import { Module } from '@nestjs/common';
import { ActivityStreamModule } from './activityStreams/activityStream.module';
import { AdminModule } from './admins/admin.module';
import { AssignmentModule } from './assignments/assignment.module';
import { AuthModule } from './auth/auth.module';
import { BlackListModule } from './blackLists/blackList.module';
import { ClassModule } from './classes/class.module';
import { ClassStudentModule } from './classStudents/classStudent.module';
import { DeviceModule } from './devices/device.module';
import { GradeReviewModule } from './gradeReviews/gradeReview.module';
import { GradingAssignmentModule } from './gradingAssignments/gradingAssignment.module';
import { NotificationModule } from './notifications/notification.module';
import { TokenModule } from './token/token.module';
import { UserActivationModule } from './userActivations/userActivation.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    UserModule,
    ClassModule,
    ClassStudentModule,
    AssignmentModule,
    AuthModule,
    TokenModule,
    GradingAssignmentModule,
    ActivityStreamModule,
    GradeReviewModule,
    AdminModule,
    BlackListModule,
    NotificationModule,
    UserActivationModule,
    DeviceModule,
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
