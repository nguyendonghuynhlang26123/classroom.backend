import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassTopicControllerV1 } from './controller/classTopic.controller';
import { ClassTopicService } from './services/classTopic.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [ClassTopicControllerV1],
  providers: [
    ClassTopicService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [ClassTopicService],
})
export class ClassTopicModule {}
