import {
  Injectable,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoggerUtilService } from '../../../../modules/shared/loggerUtil';
import { jwtConstants } from '../constants/constants';
import { TokenService } from '../../token/token.service';
import { LoginDto } from 'src/interfaces';
import { IPayLoadToken } from 'src/interfaces';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private _tokenService: TokenService,
    private jwtService: JwtService,
    private _logUtil: LoggerUtilService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getOneUser(email);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      return null;
    }
    const { password, ...result } = user;
    const data: IPayLoadToken = {
      _id: result._id,
      email: result.email,
    };
    return data;
  }

  async login(user: LoginDto) {
    if (!user) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    let data;
    if (user.email) {
      data = await this.validateUser(user.email, user.password);
    }
    if (!user.email) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
    const token = await this._tokenService.createToken(
      'user',
      data._id,
      Date.now() + 2592000000,
    );
    return {
      user: data,
      access_token: this.jwtService.sign({ ...data }),
      refresh_token: this.jwtService.sign(
        { ...data, jwt_id: token._id },
        {
          expiresIn: 2592000,
          secret: jwtConstants.refresh_secret,
        },
      ),
    };
  }

  async loginByGoogle(user: {
    email: string;
    google_id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }) {
    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    let data = await this.usersService.createGoogleUser(user);
    delete data.password;
    const token = await this._tokenService.createToken(
      'user',
      data._id,
      Date.now() + 2592000000,
    );
    return {
      user: data,
      access_token: this.jwtService.sign({ ...data }),
      refresh_token: this.jwtService.sign(
        { ...data, jwt_id: token._id },
        {
          expiresIn: 2592000,
          secret: jwtConstants.refresh_secret,
        },
      ),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const check: IPayLoadToken = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: jwtConstants.refresh_secret,
        },
      );
      if (!check || !check.jwt_id) {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
      const token = await this._tokenService.getToken(check.jwt_id);

      if (token.is_revoked) {
        throw new UnprocessableEntityException('Refresh token revoked');
      }
      if (token.expires < Date.now()) {
        throw new UnprocessableEntityException('Refresh token expired');
      }
      const result = await this.usersService.getOneUser(check.email);
      if (!result) {
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      }

      const data: IPayLoadToken = {
        _id: result._id,
        email: result.email,
      };
      return {
        user: data,
        refresh_token: refreshToken,
        access_token: this.jwtService.sign(data),
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AuthService');
      throw new HttpException('Token Expried', HttpStatus.CONFLICT);
    }
  }

  async logOut(refresh_token: string) {
    if (!refresh_token) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
    const payload = this.jwtService.verify(refresh_token, {
      secret: jwtConstants.refresh_secret,
    });
    return await this._tokenService.revokeToken(payload.jwt_id);
  }

  async verifyToken(token) {
    try {
      const data = await this.jwtService.verifyAsync(token);
      return data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
