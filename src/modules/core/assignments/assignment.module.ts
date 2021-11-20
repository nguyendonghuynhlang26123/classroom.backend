import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AssignmentControllerV1 } from './controller/assignment.controller';
import { AssignmentService } from './services/assignment.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [AssignmentControllerV1],
  providers: [
    AssignmentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [AssignmentService],
})
export class AssignmentModule {}
