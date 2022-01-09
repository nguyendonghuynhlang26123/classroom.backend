import { Module, CacheModule, Global, forwardRef } from '@nestjs/common';
import { UserActivationService } from '../userActivations/services/userActivation.service';
import { UserActivationModule } from '../userActivations/userActivation.module';
import { UserControllerV1 } from './controller/user.controller';
import { UserService } from './services/user.service';

@Global()
@Module({
  imports: [CacheModule.register(), forwardRef(() => UserActivationModule)],
  controllers: [UserControllerV1],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
