import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserActivationControllerV1 } from './controller/userActivation.controller';
import { UserActivationService } from './services/userActivation.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [UserActivationControllerV1],
  providers: [UserActivationService],
  exports: [UserActivationService],
})
export class UserActivationModule {}
