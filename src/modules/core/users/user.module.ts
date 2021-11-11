import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserControllerV1 } from './controller/user.controller';
import { UserService } from './services/user.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [UserControllerV1],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
