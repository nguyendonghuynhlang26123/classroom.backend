import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
@Injectable()
export class JwtCusAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, customer, info, context) {
    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !customer || customer.refresh || !customer.is_customer) {
      if (allowAny) return true;
      throw err || new UnauthorizedException();
    }
    return customer;
  }
}
