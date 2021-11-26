import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GradePolicyControllerV1 } from './controller/gradePolicy.controller';
import { GradePolicyService } from './services/gradePolicy.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [GradePolicyControllerV1],
  providers: [
    GradePolicyService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [GradePolicyService],
})
export class GradePolicyModule {}
