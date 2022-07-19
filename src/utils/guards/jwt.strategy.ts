import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "rxjs";
import { ApiConfigService } from "src/common/api-config/api.config.service";
import { UsersService } from "src/endpoints/users/user.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject() private configService: ApiConfigService,
        @Inject() private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJwtSecret()
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findOne(payload.sub);
        if (user) {
            return user;
        }
        return false;
    }
}