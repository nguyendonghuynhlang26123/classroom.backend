import { Module, Global, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as schema from './schemas';
import * as repository from './repositorys';
import APP_CONFIG from '../../../config';

@Global()
@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forRoot(APP_CONFIG.mongodb.url),
    MongooseModule.forFeature([
      { name: 'users', schema: schema.UserSchema },
      { name: 'classes', schema: schema.ClassSchema },
      { name: 'refresh_tokens', schema: schema.TokenSchema },
      { name: 'assignments', schema: schema.AssignmentSchema },
      { name: 'class-students', schema: schema.ClassStudentSchema },
      { name: 'grading-assignments', schema: schema.GradingAssignmentSchema },
      { name: 'activity-streams', schema: schema.ActivityStreamSchema },
      { name: 'grade-reviews', schema: schema.GradeReviewSchema },
      { name: 'admins', schema: schema.AdminSchema },
      { name: 'black-lists', schema: schema.BlackListSchema },
    ]),
  ],
  providers: [
    repository.UserRepository,
    repository.ClassRepository,
    repository.AssignmentRepository,
    repository.TokenRepository,
    repository.ClassStudentRepository,
    repository.GradingAssignmentRepository,
    repository.ActivityStreamRepository,
    repository.GradeReviewRepository,
    repository.AdminRepository,
    repository.BlackListRepository,
  ],
  exports: [
    repository.UserRepository,
    repository.ClassRepository,
    repository.AssignmentRepository,
    repository.TokenRepository,
    repository.ClassStudentRepository,
    repository.GradingAssignmentRepository,
    repository.ActivityStreamRepository,
    repository.GradeReviewRepository,
    repository.AdminRepository,
    repository.BlackListRepository,
  ],
})
export class RepositoryModule {}
