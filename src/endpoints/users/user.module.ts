import { Module } from '@nestjs/common';
import { CachingModule } from 'src/common/caching/caching.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { UsersService } from './user.service';

@Module({
  imports: [DatabaseModule, CachingModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }