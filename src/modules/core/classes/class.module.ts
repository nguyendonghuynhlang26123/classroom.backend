import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassControllerV1 } from './controller/class.controller';
import { ClassService } from './services/class.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [ClassControllerV1],
  providers: [
    ClassService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [ClassService],
})
export class ClassModule {}
