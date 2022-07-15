import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersModule } from '../users/user.module';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { ApiModule } from 'src/common/network/api.module';
import { MessageModule } from '../message/message.module';
import { S3Service } from 'src/utils/services/s3.service';
import { ConfigService } from '@nestjs/config';
import { MicroserviceModule } from 'src/common/microservice/microservice.module';
import { CachingModule } from 'src/common/caching/caching.module';

@Module({
  imports: [DatabaseModule, UsersModule, ApiConfigModule, ApiModule, MessageModule,
    MicroserviceModule, CachingModule
  ],
  controllers: [RoomController],
  providers: [
    RoomService,S3Service,ConfigService
  ],
  exports: [RoomService]
})
export class RoomModule { }
