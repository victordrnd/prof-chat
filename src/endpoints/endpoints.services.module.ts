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
import { PassportModule } from "@nestjs/passport";
import { UsersService } from "./users/user.service";
import { MapsModule } from './maps/maps.module';

@Module({
  imports: [
    TestSocketModule,
    UsersModule,
    RoomModule,
    MessageModule,
    ConfigModule,
    ApiConfigModule,
    PassportModule.register({      
      defaultStrategy: 'jwt',      
      property: 'user',      
      session: false,    
  }), 
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      inject: [ApiConfigService],
      useFactory(config: ApiConfigService) {
        return {
          secret: config.getJwtSecret(),
          
          // signOptions: { expiresIn: '60s' }
        }
      }
    }), MapsModule
  ],
  exports: [
    TestSocketModule, UsersModule,
  ],
  providers: [ConfigService,
    {
      provide: 'JWT_STRATEGY',
      useFactory: (apiConfigService: ApiConfigService, userService : UsersService) => {
        return new JwtStrategy(apiConfigService, userService);
      },
      inject: [ApiConfigService, UsersService] 
    }
  ],
})
export class EndpointsServicesModule { }