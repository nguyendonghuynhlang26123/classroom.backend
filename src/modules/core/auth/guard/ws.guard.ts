import { Injectable, CanActivate } from '@nestjs/common';
import * as cookie from 'cookie';
import { AuthService } from '../services/auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: any): Promise<boolean | any> {
    const bearerToken = context.args[0].handshake.headers.cookie;
    // console.log(context.args[0].handshake.user);
    const cookies = cookie.parse(bearerToken);
    // console.log(cookies);
    try {
      let user = await this.authService.verifyToken(cookies.access_token_cms);

      if (user) {
        context.args[0].handshake.user = user;
        return user;
      } else {
        return false;
      }
    } catch (ex) {
      //   console.log(ex);
      return false;
    }
  }
}
