import { Module } from '@nestjs/common';
import { CachingModule } from './common/caching/caching.module';
import { MetricsController } from './common/metrics/metrics.controller';
import { MetricsModule } from './common/metrics/metrics.module';
import { ApiConfigModule } from './common/api-config/api.config.module';
import { CacheController } from './common/caching/cache.controller';
import { MicroserviceModule } from './common/microservice/microservice.module';
import { TestSocketController } from './endpoints/test-sockets/test.socket.controller';
import { TestSocketModule } from './endpoints/test-sockets/test.socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Module({
  imports: [
    ApiConfigModule,
    CachingModule,
    MetricsModule,
    MicroserviceModule,
    TestSocketModule,
    
  ],
  controllers: [
    MetricsController,
    CacheController,
    TestSocketController,
  ],
})
export class PrivateAppModule { }
