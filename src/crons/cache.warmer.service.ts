import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ClientProxy } from "@nestjs/microservices";
import { Locker } from "src/utils/locker";
import { Constants } from "src/utils/constants";
import { CachingService } from "src/common/caching/caching.service";

@Injectable()
export class CacheWarmerService {
  constructor(
    private readonly cachingService: CachingService,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
  ) { }

  // @Cron('* * * * *')
  // async handleExampleInvalidations() {
  //   await Locker.lock('Example invalidations', async () => {
  //   }, true);
  // }

  private async invalidateKey<T>(key: string, data: T, ttl: number) {
    await Promise.all([
      this.cachingService.setCache(key, data, ttl),
      this.deleteCacheKey(key),
    ]);
  }

  private async deleteCacheKey(key: string) {
    await this.clientProxy.emit('deleteCacheKeys', [key]);
  }
}