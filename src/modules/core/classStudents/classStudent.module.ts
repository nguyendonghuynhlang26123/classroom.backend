import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassStudentControllerV1 } from './controller/classStudent.controller';
import { ClassStudentService } from './services/classStudent.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [ClassStudentControllerV1],
  providers: [
    ClassStudentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [ClassStudentService],
})
export class ClassStudentModule {}
