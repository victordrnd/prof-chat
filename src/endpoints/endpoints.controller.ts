import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { AuthController } from "./auth/auth.controller";
import { EndpointsServicesModule } from "./endpoints.services.module";
import { TokensController } from "./tokens/token.controller";
import { UsersController } from "./users/user.controller";

@Module({
  imports: [
    CommonModule,
    EndpointsServicesModule,
  ],
  controllers: [
    AuthController, UsersController, TokensController,
  ],
})
export class EndpointsControllersModule { }