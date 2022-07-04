import { Module } from "@nestjs/common";
import { TestSocketModule } from "./test-sockets/test.socket.module";
import { UsersModule } from "./users/user.module";
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';
import { ApiConfigModule } from "src/common/api-config/api.config.module";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "src/utils/guards/jwt.strategy";

@Module({
  imports: [
    TestSocketModule,
    UsersModule,
    RoomModule,
    MessageModule,
    ConfigModule,
    ApiConfigModule,
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory(config: ApiConfigService) {
        return {
          secret: config.getJwtSecret(),
          signOptions: { expiresIn: '60s' }
        }
      }
    })
  ],
  exports: [
    TestSocketModule, UsersModule,
  ],
  providers: [ConfigService,
    {
      provide: 'JWT_STRATEGY',
      useFactory: (apiConfigService: ApiConfigService) => {
        return new JwtStrategy(apiConfigService);
      },
      inject: [ApiConfigService]
    }
  ],
})
export class EndpointsServicesModule { }