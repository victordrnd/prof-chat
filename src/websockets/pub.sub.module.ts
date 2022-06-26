import { forwardRef, Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { CachingModule } from 'src/common/caching/caching.module';
import { MicroserviceController } from 'src/common/microservice/microservice.controller';
import { MessageModule } from 'src/endpoints/message/message.module';
import { RoomModule } from 'src/endpoints/room/room.module';
import { ChatService } from './chat.service';
import { EventsGateway } from './events.gateway';
import { PubSubController } from './pub.sub.controller';

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => CachingModule),
    MessageModule,
    RoomModule
  ],
  controllers: [
    PubSubController, MicroserviceController,
  ],
  providers: [
    EventsGateway,
    ChatService
  ],
  exports : [ChatService]
})
export class PubSubModule { }
