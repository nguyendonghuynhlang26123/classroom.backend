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
      { name: 'class-topics', schema: schema.ClassTopicSchema },
    ]),
  ],
  providers: [
    repository.UserRepository,
    repository.ClassRepository,
    repository.AssignmentRepository,
    repository.TokenRepository,
    repository.ClassTopicRepository,
  ],
  exports: [
    repository.UserRepository,
    repository.ClassRepository,
    repository.AssignmentRepository,
    repository.TokenRepository,
    repository.ClassTopicRepository,
  ],
})
export class RepositoryModule {}
