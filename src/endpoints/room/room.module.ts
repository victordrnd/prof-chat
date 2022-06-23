import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersModule } from '../users/user.module';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { ApiModule } from 'src/common/network/api.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports : [DatabaseModule, UsersModule, ApiConfigModule, ApiModule, MessageModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
