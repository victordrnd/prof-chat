import { forwardRef, Module } from '@nestjs/common';
import { ApiConfigModule } from 'src/common/api-config/api.config.module';
import { CachingModule } from 'src/common/caching/caching.module';
import { MicroserviceController } from 'src/common/microservice/microservice.controller';
import { MessageModule } from 'src/endpoints/message/message.module';
import { EventsGateway } from './events.gateway';
import { PubSubController } from './pub.sub.controller';

@Module({
  imports: [
    ApiConfigModule,
    forwardRef(() => CachingModule),
    MessageModule
  ],
  controllers: [
    PubSubController, MicroserviceController,
  ],
  providers: [
    EventsGateway,
  ],
})
export class PubSubModule { }
