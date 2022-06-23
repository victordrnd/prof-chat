import { Module } from "@nestjs/common";
import { TestSocketModule } from "./test-sockets/test.socket.module";
import { UsersModule } from "./users/user.module";
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TestSocketModule,
    UsersModule,
    RoomModule,
    MessageModule,
  ],
  exports: [
    TestSocketModule, UsersModule,
  ],
  providers: [],
})
export class EndpointsServicesModule { }