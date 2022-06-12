import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
  imports : [DatabaseModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports : [MessageService]
})
export class MessageModule {}
