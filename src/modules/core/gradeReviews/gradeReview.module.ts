import { Module, CacheModule, Global } from '@nestjs/common';
import { GradeReviewControllerV1 } from './controller/gradeReview.controller';
import { GradeReviewService } from './services/gradeReview.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [GradeReviewControllerV1],
  providers: [GradeReviewService],
  exports: [GradeReviewService],
})
export class GradeReviewModule {}
