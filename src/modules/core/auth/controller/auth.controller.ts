import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../../modules/core/auth/services/auth.service';
import {
  CreateUserDto,
  GoogleCreateUserDto,
  LoginDto,
  LoginGoogleDto,
} from 'src/interfaces';
import { LogOutService } from '../services/logOut.service';
import { UserService } from '../../users/services/user.service';
import { User } from 'src/modules/connector/repository';
import { HttpService } from '@nestjs/axios';

@ApiTags('Authenticate')
@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private logOutService: LogOutService,
    private httpService: HttpService,
  ) {
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(data);
    return res.send({
      data: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @Post('register')
  async createService(@Body() body: CreateUserDto, @Res() res: Response) {
    let user = await this.userService.createUser(body);
    let data: LoginDto = {
      email: user.email,
      password: body.password,
    };
    const result = await this.authService.login(data);
    return res.send({
      data: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @Post('google-activate')
  async googleCreateService(
    @Body() body: LoginGoogleDto,
    @Res() res: Response,
  ): Promise<any> {
    const request = await this.httpService
      .get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${body.token_id}`,
      )
      .toPromise();
    const data = request.data;
    if (
      data.azp == process.env.REACT_APP_GOOGLE_API_KEY &&
      request.status == 200
    ) {
      let user = {
        email: data.email,
        google_id: data.sub,
        first_name: data.given_name,
        last_name: data.family_name,
        avatar: data.picture,
      };
      let result = await this.authService.loginByGoogle(user);
      return res.send({
        data: result.user,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
    }
    return HttpStatus.BAD_REQUEST;
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @Post('refresh')
  async refreshToken(
    @Body() body: { refresh_token: string },
    @Req() req,
    @Res() res: Response,
  ) {
    let token = body.refresh_token;
    if (token[token.length - 1] == ',') {
      token = token.substring(0, token.length - 1);
    }
    const result = await this.authService.refreshToken(token);
    return res.send({
      data: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @Body() body: { refresh_token: string },
    @Res() res: Response,
    @Req() req,
  ) {
    if (body.refresh_token) {
      await this.authService.logOut(body.refresh_token);
    }
    return res.send({ status: 200 });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @Post('logout_all')
  async logoutAll(@Res() res: Response, @Req() req) {
    await this.logOutService.logOutAllDevice(req.user);
    return res.send({ status: 200 });
  }
}
