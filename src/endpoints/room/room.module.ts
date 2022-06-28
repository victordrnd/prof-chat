import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersModule } from '../users/user.module';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { ApiModule } from 'src/common/network/api.module';
import { MessageModule } from '../message/message.module';
import { EventsGateway } from 'src/websockets/events.gateway';
import { ChatService } from 'src/websockets/chat.service';
import { PubSubModule } from 'src/websockets/pub.sub.module';
import { ApiConfigService } from 'src/common/api-config/api.config.service';
import { ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { S3Service } from 'src/utils/services/s3.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { MicroserviceModule } from 'src/common/microservice/microservice.module';

@Module({
  imports: [DatabaseModule, UsersModule, ApiConfigModule, ApiModule, MessageModule,
    MicroserviceModule
  ],
  controllers: [RoomController],
  providers: [
    RoomService,S3Service,ConfigService
  ],
  exports: [RoomService]
})
export class RoomModule { }
