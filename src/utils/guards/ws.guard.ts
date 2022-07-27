import { CanActivate, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ApiConfigService } from "src/common/api-config/api.config.service";

@Injectable()
export class WsGuard implements CanActivate {

  constructor(private jwtService: JwtService,
    private configService : ApiConfigService) {
  }

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    try {
    const bearerToken = context.args[0].handshake.query.Authorization.split(' ')[1];
      const decoded = this.jwtService.verify(bearerToken, {secret : this.configService.getJwtSecret() }) as any;
      return new Promise((resolve, reject) => {
        if (decoded.sub) {
          context.switchToHttp().getRequest().user = decoded.sub;
          resolve(decoded.sub)
        } else {
          reject(false)
        }
      });
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }
}
