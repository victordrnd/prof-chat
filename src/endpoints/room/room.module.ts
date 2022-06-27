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

@Module({
  imports: [DatabaseModule, UsersModule, ApiConfigModule, ApiModule, MessageModule,

  ],
  controllers: [RoomController],
  providers: [RoomService,S3Service,ConfigService,
    {
      provide: 'PUBSUB_SERVICE',
      useFactory: (apiConfigService: ApiConfigService) => {
        const clientOptions: ClientOptions = {
          transport: Transport.REDIS,
          options: {
            url: `redis://${apiConfigService.getRedisUrl()}:6379`,
            retryDelay: 1000,
            retryAttempts: 10,
            retry_strategy: function () {
              return 1000;
            },
          },
        };

        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ApiConfigService]
    }
  ],
  exports: [RoomService]
})
export class RoomModule { }
