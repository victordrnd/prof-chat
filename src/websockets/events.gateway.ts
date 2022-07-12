import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "src/endpoints/message/dto/create-message.dto";
import { MessageService } from "src/endpoints/message/message.service";
import { Room } from "src/endpoints/room/entities/room.entity";
import { Message } from "src/endpoints/message/entities/message.entity";
import { RoomService } from "src/endpoints/room/room.service";
import { S3Service } from "src/utils/services/s3.service";
import { MessagePattern } from "@nestjs/microservices";
import { NotificationService } from "src/utils/services/notification.service";
import { UsersService } from "src/endpoints/users/user.service";

@Injectable()
@WebSocketGateway(3005, { transports: ['websocket'], cors: false, maxHttpBufferSize: 1e9, pingTimeout: 600000 })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  logger;

  rooms: { room_id: string, users: userInfo[], messages? : ClassRoomMessage[] }[] = [];
  constructor(private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private readonly notificationService : NotificationService,
    private readonly userService : UsersService,
    private s3Service: S3Service) {
    this.logger = new Logger(EventsGateway.name);
  }


  handleConnection(client: Socket, ...args: any[]) { }



  @WebSocketServer()
  webSocketServer!: Server | undefined;


  @SubscribeMessage('register')
  async handleRegisterEvent(@ConnectedSocket() client: Socket, @MessageBody() userInfo: any) {
    const user_rooms: Room[] = await this.roomService.findAll(userInfo.userId);
    client.join('user-' + userInfo.userId);
    user_rooms.forEach(room => {
      client.join(room.id?.toString()!);
    });
    return "ok";
  }


  @SubscribeMessage('new_message')
  async handleNewMessageEvent(@ConnectedSocket() socket: Socket, @MessageBody() message: Message) {
    let file;
    if (message!.files!.length) {
      file = await this.s3Service.uploadFile(message.files![0]);
      message.type = message.files![0]!.type
      message.content = file
    }
    const new_message = await this.messageService.create(message);
    delete new_message.files
    const room = await this.roomService.findOne(message.roomId!);  
    const sender = await this.userService.findOne(message.userId!);
    if (file) {
      new_message.content = this.s3Service.getObjectUrl(message.content!);
    }
    this.notificationService.sendToDevice(room?.users!.filter(user => user.id != message.userId) || [], `New message from ${sender?.firstname} ${sender?.lastname}`, message.type == "text" ? message.content! : "New file");
    
    this.webSocketServer!.in(message.roomId?.toString()!).emit('new_message', new_message);
  }
  @SubscribeMessage('new_room')
  handleNewRoomEvent(@ConnectedSocket() socket: Socket, @MessageBody() room: Room) {
    room.users?.map(user => {
      this.webSocketServer?.in('user-'+user.id).socketsJoin(room.id!.toString());
    }); 
    this.webSocketServer?.in(room.id!.toString()).emit('new_room', room);
  }

  @SubscribeMessage('classroom.join')
  handleJoinClassroomEvent(@ConnectedSocket() socket: Socket, @MessageBody() joinInfo: JoinRoom) {
    let room = this.rooms.find(room => room.room_id == 'room' + joinInfo.room_id);
    let firstToJoin = false;
    const user_info = { user_id: joinInfo.user_id, sessionDescription: joinInfo.sessionDescription, socket_id: socket.id };
    if (!room) {
      firstToJoin = true;
      room = { room_id: 'room' + joinInfo.room_id, users: [user_info], messages : [] };
      this.rooms.push(room);
    }
    if (!firstToJoin) {
      room.users.push(user_info);
      const otherUser = room.users.find(user => user.user_id != joinInfo.user_id);
      if (otherUser) {
        socket.emit('classroom.need_answer', otherUser);
      }
    }
    socket.join(room.room_id);
  }

  @SubscribeMessage('classroom.answer')
  handleAnswer(@ConnectedSocket() socket: Socket, @MessageBody() answer: AnswerInfo) {
    this.webSocketServer!.to('room' + answer.room_id).emit('classroom.answer', answer);
  }

  @SubscribeMessage('classroom.new-ice-candidate')
  handleNewICECandidate(@ConnectedSocket() socket: Socket, @MessageBody() candidat: NewIceCandidateInfo) {
    this.webSocketServer!.to('room' + candidat.room_id).emit('classroom.new-ice-candidate', candidat.candidat);
  }


  @SubscribeMessage('classroom.negociating')
  handleNegociating(@ConnectedSocket() socket: Socket, @MessageBody() negociating: NegociatingInfo) {
    this.webSocketServer!.to('room' + negociating.room_id).emit('classroom.negociating', negociating);
  }

  @SubscribeMessage('classroom.camera_toggle')
  handleCameraToggle(@ConnectedSocket() socket: Socket, @MessageBody() event: CameraToggleEvent) {
    socket?.to('room' + event.room_id).emit('classroom.camera_toggle', event);
  }



  @SubscribeMessage('classroom.new_message')
  async handleMessageChat(@ConnectedSocket() socket: Socket, @MessageBody() message: ClassRoomMessage) {
    let file;
    if (message!.files!.length) {
      file = await this.s3Service.uploadFile(message.files![0]);
      message.type = message.files![0]!.type
      message.content = file
    }
    if(file)
      message.content = this.s3Service.getObjectUrl(message.content!)!;
    this.webSocketServer?.in('room' + message.room_id).emit('classroom.new_message', message);
  }

  @SubscribeMessage('classroom.disconnect')
  handleDisconnectEvent(@ConnectedSocket() socket: Socket) {
    const room = this.rooms.find(room => {
      return room.users.findIndex(user => user.socket_id == socket.id) != -1
    });
    if (room) {
      room.users = [];
      this.webSocketServer?.to(room.room_id).emit('classroom.disconnect');
    }
    this.handleDisconnect(socket);
  }

  handleDisconnect(client: Socket) {
    this.webSocketServer?.allSockets().then(sockets => {
      this.rooms = this.rooms.map((room) => { 
        const initialLength = room.users.length;
        room.users = room.users.filter(user => sockets.has(user.socket_id));
        if(initialLength != room.users.length){
          this.webSocketServer?.to(room.room_id).emit('classroom.disconnect');
        } 
        return room
      });
    })
    this.cleanEmptyRooms();
  }

  cleanEmptyRooms() {
    this.rooms = this.rooms.filter(room => room.users.length != 0);
  }
  

}



interface JoinRoom {
  room_id: number;
  user_id: number;
  sessionDescription: RTCSessionDescription
}

interface userInfo {
  user_id: number;
  sessionDescription: RTCSessionDescription;
  socket_id: string;
}

interface NewIceCandidateInfo {
  room_id: number;
  candidat: RTCIceCandidate
}

interface NegociatingInfo {
  room_id: number;
  sessionDescription: RTCSessionDescription
}

interface AnswerInfo {
  room_id: number;
  answer: RTCSessionDescriptionInit
}

interface ClassRoomMessage {
  files? : any[];
  type? : string;
  content: string;
  user_id: number;
  date: Date;
  room_id: number
}

interface CameraToggleEvent {
  room_id : number;
  active : boolean;
}