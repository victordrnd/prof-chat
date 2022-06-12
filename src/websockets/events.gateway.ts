import { Injectable, Logger } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io';
import { CreateMessageDto } from "src/endpoints/message/dto/create-message.dto";
import { MessageService } from "src/endpoints/message/message.service";

@Injectable()
@WebSocketGateway(3005, { transports: ['websocket'] })
export class EventsGateway {
  private readonly logger: Logger;

  constructor(private readonly messageService: MessageService) {
    this.logger = new Logger(EventsGateway.name);
  }

  @WebSocketServer()
  webSocketServer: Server | undefined;

  onTest(payload: unknown) {
    this.logger.log(`Received onTest event with payload '${JSON.stringify(payload)}'`);
    this.webSocketServer?.emit('test', payload);

  }


  @SubscribeMessage('new_message')
  handleEvent(@MessageBody() data: CreateMessageDto): CreateMessageDto {
    this.messageService.create(data);
    return data;
  }



}