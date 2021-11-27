import { Module } from '@nestjs/common';
import { AssignmentModule } from './assignments/assignment.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './classes/class.module';
import { ClassStudentModule } from './classStudents/classStudent.module';
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
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
