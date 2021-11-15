import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './classes/class.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    UserModule,
    ClassModule,
    AuthModule,
    TokenModule
  ],
  providers: [],
  exports: [],
})
export class CoreModule {}
