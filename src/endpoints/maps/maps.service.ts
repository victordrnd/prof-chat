import {  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from 'src/common/api-config/api.config.service';
import { firstValueFrom } from 'rxjs';
import { CachingService } from 'src/common/caching/caching.service';
@Injectable()
export class MapsService {

    constructor(private readonly http : HttpService,
        private configService : ApiConfigService,
        private cachingService : CachingService){}


    
    async getAccessToken() : Promise<any>{
        return await this.cachingService.getOrSetCache('apple_token', async () => {
            const token = this.configService.getMapsJWT();
            return firstValueFrom(this.http.get('https://maps-api.apple.com/v1/token', {headers : {"Authorization" : `Bearer ${token}`}})).then(res => res.data);
        }, 1700)
    }
}
