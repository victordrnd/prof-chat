import { Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { config } from "rxjs";
import { ApiConfigService } from "src/common/api-config/api.config.service";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject() private configService: ApiConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getJwtSecret()
        });
        console.log(configService.getJwtSecret());
    }

    async validate(payload: any) {
        return {id: payload.sub}
    }
}