import { Module } from '@nestjs/common';
import { MapsService } from './maps.service';
import { MapsController } from './maps.controller';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports : [ApiConfigModule, HttpModule],
  controllers: [MapsController],
  providers: [MapsService]
})
export class MapsModule {}
