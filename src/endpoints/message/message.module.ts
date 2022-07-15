import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { S3Service } from 'src/utils/services/s3.service';
import { ConfigService } from '@nestjs/config';
import { CachingModule } from 'src/common/caching/caching.module';

@Module({
  imports : [DatabaseModule, CachingModule],
  controllers: [MessageController],
  providers: [MessageService, S3Service, ConfigService],
  exports : [MessageService]
})
export class MessageModule {}
