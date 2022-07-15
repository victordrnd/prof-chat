import {  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from 'src/common/api-config/api.config.service';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class MapsService {

    constructor(private readonly http : HttpService,
        private configService : ApiConfigService){}


    fetch(query = ''){
        const token = this.configService.getMapsJWT();
        return firstValueFrom(this.http.get(`https://maps-api.apple.com/v1/search?q=${query}`, {headers : {"Authorization" : `Bearer ${token}`}})).then(res => res.data);
    }
}
