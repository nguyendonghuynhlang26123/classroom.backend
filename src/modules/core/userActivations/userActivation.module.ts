import { Module, CacheModule, Global, forwardRef } from '@nestjs/common';
import { UserService } from '../users/services/user.service';
import { UserModule } from '../users/user.module';
import { UserActivationControllerV1 } from './controller/userActivation.controller';
import { UserActivationService } from './services/userActivation.service';

@Global()
@Module({
  imports: [CacheModule.register(), forwardRef(() => UserModule)],
  controllers: [UserActivationControllerV1],
  providers: [UserActivationService],
  exports: [UserActivationService],
})
export class UserActivationModule {}
