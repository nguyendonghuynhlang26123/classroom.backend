import { Module } from '@nestjs/common';
import { ActivityStreamModule } from './activityStreams/activityStream.module';
import { AssignmentModule } from './assignments/assignment.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './classes/class.module';
import { ClassStudentModule } from './classStudents/classStudent.module';
import { GradingAssignmentModule } from './gradingAssignments/gradingAssignment.module';
import { TokenModule } from './token/token.module';
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
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
