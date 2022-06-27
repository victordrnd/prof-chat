import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "src/endpoints/message/dto/create-message.dto";
import { MessageService } from "src/endpoints/message/message.service";
import { Room } from "src/endpoints/room/entities/room.entity";
import { Message } from "src/endpoints/message/entities/message.entity";
import { RoomService } from "src/endpoints/room/room.service";
import { S3Service } from "src/utils/services/s3.service";

@Injectable()
@WebSocketGateway(3005, { transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection {

  constructor(private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private s3Service : S3Service) {
  }
  handleConnection(client: Socket, ...args: any[]) { }

  @WebSocketServer()
  webSocketServer!: Server | undefined;


  @SubscribeMessage('register')
  async handleRegisterEvent(@ConnectedSocket() client: Socket, @MessageBody() userInfo: any) {
    const user_rooms: Room[] = await this.roomService.findAll(userInfo.userId);
    user_rooms.forEach(room => {
      client.join(room.id?.toString()!);
    });
    return "ok";
  }


  @SubscribeMessage('new_message')
  handleNewMessageEvent(@ConnectedSocket() socket: Socket, @MessageBody() message: Message) {
    let files : string[] = [];
    if(message!.files!.length){
     files = this.messageService.uploadFiles(message.files!);
      message.type = "file"
    }
    this.messageService.create(message);
    if(files.length){
      message.files = [{
        url : this.s3Service.getObjectUrl(files[0]),
        name : files[0],
        type : message.files![0]!.type
      }];
    }
    this.webSocketServer!.in(message.roomId?.toString()!).emit('new_message', message);
  }

  // @SubscribeMessage('new_room')
  handleNewRoomEvent(room: Room) {
    console.log('new room create : ', room);
    // this.webSocketServer.
  }




}