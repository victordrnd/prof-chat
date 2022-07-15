import { Controller, Get, Logger, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MapsService } from './maps.service';

@Controller('maps')
@ApiTags('maps')
export class MapsController {
  logger;
  constructor(private readonly mapsService: MapsService) { 
    this.logger = new Logger()
  }



  @Get('/search')
  async search(@Request() req: any) {
    try {
      return await this.mapsService.fetch(req.query.query)
    } catch (e : any) {
      
      return e;
      // return { error: "An error occured" };
    }
  }


}
