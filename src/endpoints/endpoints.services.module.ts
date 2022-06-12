import { Module } from "@nestjs/common";
import { TestSocketModule } from "./test-sockets/test.socket.module";
import { TokenModule } from "./tokens/token.module";
import { UsersModule } from "./users/user.module";
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TestSocketModule,
    UsersModule,
    TokenModule,
    RoomModule,
    MessageModule,
  ],
  exports: [
    TestSocketModule, UsersModule, TokenModule,
  ],
  providers: [],
})
export class EndpointsServicesModule { }