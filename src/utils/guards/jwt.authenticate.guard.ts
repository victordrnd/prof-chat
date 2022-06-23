import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { UsersService } from 'src/endpoints/users/user.service';
import { ApiConfigService } from '../../common/api-config/api.config.service';

@Injectable()
export class JwtAuthenticateGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private userService : UsersService
  ) {
    this.logger = new Logger(JwtAuthenticateGuard.name);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization: string = request.headers['authorization'];
    if (!authorization) {
      return false;
    }

    const jwt = authorization.replace('Bearer ', '');

    try {
      const jwtSecret = this.apiConfigService.getJwtSecret();

      request.jwt = await new Promise((resolve, reject) => {
        verify(jwt, jwtSecret, async (err, decoded) => {
          if (err) {
            reject(err);
          }
          const user_id : number = parseInt(decoded?.sub || "");
          const userInfo = await this.userService.findOne(user_id);
          resolve(userInfo);
        });
      });

    } catch (error) {
      this.logger.error(error);
      return false;
    }

    return true;
  }
}