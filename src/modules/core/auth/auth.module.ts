import { Global, Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { TokenModule } from '../token/token.module';
import { LogOutService } from './services/logOut.service';
import { HttpModule } from '@nestjs/axios';
import { AdminModule } from '../admins/admin.module';
import { BlackListModule } from '../blackLists/blackList.module';

@Global()
@Module({
  imports: [
    UserModule,
    AdminModule,
    TokenModule,
    PassportModule,
    BlackListModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' }, // 5p
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LogOutService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
