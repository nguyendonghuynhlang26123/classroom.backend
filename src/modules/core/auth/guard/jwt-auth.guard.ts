import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user || user.jwt_id) {
      if (allowAny) return true;
      throw err || new UnauthorizedException();
    }

    if (!user.is_activated) {
      throw new HttpException('Account is not activated', HttpStatus.FORBIDDEN);
    }

    return user;
  }
}
