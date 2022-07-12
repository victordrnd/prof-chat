import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/endpoints/message/entities/message.entity";
import { Room } from "src/endpoints/room/entities/room.entity";
import { User } from "src/endpoints/users/entities/user.entity";
import { ApiConfigModule } from "../api-config/api.config.module";
import { ApiConfigService } from "../api-config/api.config.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        name : (Math.random() + 1).toString(36).substring(7),
        type: 'mysql',
        ...apiConfigService.getDatabaseConnection(),
        entities: [User, Room, Message],
        keepConnectionAlive: true,
        synchronize: false,
        
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forFeature([User, Room, Message]),
  ],
  exports: [
    TypeOrmModule.forFeature([User, Room, Message]),
  ],
})
export class DatabaseModule { }