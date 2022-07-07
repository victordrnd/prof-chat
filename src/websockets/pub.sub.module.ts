import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { CachingModule } from 'src/common/caching/caching.module';
import { MicroserviceController } from 'src/common/microservice/microservice.controller';
import { MessageModule } from 'src/endpoints/message/message.module';
import { RoomModule } from 'src/endpoints/room/room.module';
import { UsersModule } from 'src/endpoints/users/user.module';
import { NotificationService } from 'src/utils/services/notification.service';
import { S3Service } from 'src/utils/services/s3.service';
import { ChatService } from './chat.service';
import { EventsGateway } from './events.gateway';
import { PubSubController } from './pub.sub.controller';

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => CachingModule),
    MessageModule,
    RoomModule,
    UsersModule
  ],
  controllers: [
    PubSubController, MicroserviceController,
  ],
  providers: [
    EventsGateway,
    S3Service,
    ConfigService,
    NotificationService
  ],
})
export class PubSubModule { }
