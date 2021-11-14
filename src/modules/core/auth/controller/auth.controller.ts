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
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../../modules/core/auth/services/auth.service';
import { CreateUserDto, GoogleCreateUserDto, LoginDto } from 'src/interfaces';
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
    console.log(process.env.DOMAIN_ROOT);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(data);
    return {
      data: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @Post('register')
  async createService(
    @Body() user: CreateUserDto,
  ): Promise<HttpException | User> {
    return await this.userService.createUser(user);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @Post('register/google-activate')
  async googleCreateService(@Body() body: GoogleCreateUserDto): Promise<any> {
    const request = await this.httpService
      .get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${body.token_id}`,
      )
      .toPromise();
    const data = request.data;
    if (
      data.azp == process.env.REACT_APP_GOOGLE_API_KEY &&
      data.given_name == body.first_name &&
      data.family_name == body.last_name &&
      data.email == body.email &&
      request.status == 200
    ) {
      return await this.userService.createGoogleUser(body);
    }
    return HttpStatus.BAD_REQUEST;
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
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
    return {
      data: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    };
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
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
  @Post('logout_all')
  async logoutAll(@Res() res: Response, @Req() req) {
    await this.logOutService.logOutAllDevice(req.user);
    return res.send({ status: 200 });
  }
}
