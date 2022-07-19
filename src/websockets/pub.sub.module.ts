import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { ApiConfigService } from 'src/common/api-config/api.config.service';
import { CachingModule } from 'src/common/caching/caching.module';
import { MicroserviceController } from 'src/common/microservice/microservice.controller';
import { MessageModule } from 'src/endpoints/message/message.module';
import { RoomModule } from 'src/endpoints/room/room.module';
import { UsersModule } from 'src/endpoints/users/user.module';
import { UsersService } from 'src/endpoints/users/user.service';
import { JwtStrategy } from 'src/utils/guards/jwt.strategy';
import { WsGuard } from 'src/utils/guards/ws.guard';
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
    UsersModule,
    JwtModule
  ],
  controllers: [
    PubSubController, MicroserviceController,
  ],
  providers: [
    EventsGateway,
    S3Service,
    ConfigService,
    ApiConfigService,
    NotificationService,
  ],
})
export class PubSubModule { }
