import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "src/endpoints/message/dto/create-message.dto";
import { MessageService } from "src/endpoints/message/message.service";
import { Room } from "src/endpoints/room/entities/room.entity";
import { Message } from "src/endpoints/message/entities/message.entity";
import { RoomService } from "src/endpoints/room/room.service";

@Injectable()
@WebSocketGateway(3005, { transports: ['websocket'] })
export class EventsGateway implements OnGatewayConnection {

  constructor(private readonly messageService: MessageService,
    private readonly roomService: RoomService) {
  }
  handleConnection(client: Socket, ...args: any[]) { }

  @WebSocketServer()
  webSocketServer: Server | undefined;


  @SubscribeMessage('register')
  async handleRegisterEvent(@ConnectedSocket() client: Socket, @MessageBody() userInfo: any) {
    client.join('user-' + userInfo.userId);
    const user_rooms: Room[] = await this.roomService.findAll(userInfo.userId);
    user_rooms.forEach(room => {
      client.join('room-' + room.id);
    });
    return "ok";
  }


  @SubscribeMessage('new_message')
  handleNewMessageEvent(@ConnectedSocket() socket: Socket, @MessageBody() message: Message) {
    socket.to('room-' + message.roomId).emit('new_message', message)
    socket.emit('new_message', message);
    this.messageService.create(message)
  }

  @SubscribeMessage('new_room')
  handleNewRoomEvent(room: Room) {
    // this.webSocketServer.
  }




}