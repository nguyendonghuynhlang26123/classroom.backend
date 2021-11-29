import { Module, CacheInterceptor, CacheModule, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GradingAssignmentControllerV1 } from './controller/gradingAssignment.controller';
import { GradingAssignmentService } from './services/gradingAssignment.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [GradingAssignmentControllerV1],
  providers: [
    GradingAssignmentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [GradingAssignmentService],
})
export class GradingAssignmentModule {}
