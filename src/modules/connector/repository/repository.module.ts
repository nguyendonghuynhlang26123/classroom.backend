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
    ]),
  ],
  providers: [
    repository.UserRepository,
    repository.ClassRepository,
    repository.TokenRepository,
  ],
  exports: [
    repository.UserRepository,
    repository.ClassRepository,
    repository.TokenRepository,
  ],
})
export class RepositoryModule {}
