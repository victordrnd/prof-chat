import { Controller, Get, Logger, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';

@Controller('maps')
@ApiTags('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) { 
  }


  @Get('token')
  async getToken(){
    return await this.mapsService.getAccessToken()
  }


}
