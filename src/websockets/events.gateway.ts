import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "src/endpoints/message/dto/create-message.dto";
import { MessageService } from "src/endpoints/message/message.service";
import { Room } from "src/endpoints/room/entities/room.entity";
import { Message } from "src/endpoints/message/entities/message.entity";
import { RoomService } from "src/endpoints/room/room.service";
import { S3Service } from "src/utils/services/s3.service";
import { MessagePattern } from "@nestjs/microservices";

@Injectable()
@WebSocketGateway(3005, { transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection {
  logger
  constructor(private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    private s3Service: S3Service) {
    this.logger = new Logger(EventsGateway.name);
  }
  
  handleConnection(client: Socket, ...args: any[]) { }



  @WebSocketServer()
  webSocketServer!: Server | undefined;


  @SubscribeMessage('register')
  async handleRegisterEvent(@ConnectedSocket() client: Socket, @MessageBody() userInfo: any) {
    const user_rooms: Room[] = await this.roomService.findAll(userInfo.userId);
    client.join('user-'+userInfo.userId);
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
    await this.messageService.create(message);
    if (file) {
      message.content = this.s3Service.getObjectUrl(message.content!);
    }
    this.webSocketServer!.in(message.roomId?.toString()!).emit('new_message', message);
  }
  @SubscribeMessage('new_room')
  handleNewRoomEvent(@ConnectedSocket() socket: Socket, @MessageBody() room: Room){
    console.log(room);
    room.users?.map(user => {
      this.webSocketServer?.to('user-'+user.id).emit('new_room', room);
    })
  }


}