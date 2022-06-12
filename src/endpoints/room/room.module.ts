import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
