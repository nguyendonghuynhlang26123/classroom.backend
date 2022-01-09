import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityStreamControllerV1 } from './controller/activityStream.controller';
import { ActivityStreamService } from './services/activityStream.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [ActivityStreamControllerV1],
  providers: [
    ActivityStreamService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [ActivityStreamService],
})
export class ActivityStreamModule {}
