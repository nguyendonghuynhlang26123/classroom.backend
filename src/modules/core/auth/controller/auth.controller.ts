import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  Req,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../../../modules/core/auth/services/auth.service';
import { CreateUserDto, LoginDto } from 'src/interfaces';
import { LogOutService } from '../services/logOut.service';
import { UserService } from '../../users/services/user.service';
import { User } from 'src/modules/connector/repository';

@ApiTags('Authenticate')
@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private logOutService: LogOutService,
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
    let option = {
      httpOnly: true,
    };
    if (process.env.DOMAIN_ROOT) {
      option['domain'] = process.env.DOMAIN_ROOT;
    }
    res.cookie('access_token_cms', result.access_token, {
      ...option,
    });
    res.cookie('refresh_token_cms', result.refresh_token, {
      ...option,
    });

    return res.send(result.user);
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
  @Post('refresh')
  async refreshToken(@Req() req, @Res() res: Response) {
    let option = {
      httpOnly: true,
    };
    if (process.env.DOMAIN_ROOT) {
      option['domain'] = process.env.DOMAIN_ROOT;
    }
    let token = req.cookies['refresh_token_cms'];
    if (token[token.length - 1] == ',') {
      token = token.substring(0, token.length - 1);
    }
    const result = await this.authService.refreshToken(token);
    res.cookie('access_token_cms', result.access_token, {
      ...option,
    });
    res.cookie('refresh_token_cms', result.refresh_token, {
      ...option,
    });
    return res.send(result.user);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @Post('logout')
  async logout(@Res() res: Response, @Req() req) {
    if (req.cookies['refresh_token_cms']) {
      await this.authService.logOut(req.cookies['refresh_token_cms']);
    }
    let option = {
      httpOnly: true,
    };
    if (process.env.DOMAIN_ROOT) {
      option['domain'] = process.env.DOMAIN_ROOT;
    }
    res.cookie('access_token_cms', '', {
      ...option,
    });
    res.cookie('refresh_token_cms', '', {
      ...option,
    });
    return res.send({ status: 200 });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @Post('logout_all')
  async logoutAll(@Res() res: Response, @Req() req) {
    let option = {
      httpOnly: true,
    };
    if (process.env.DOMAIN_ROOT) {
      option['domain'] = process.env.DOMAIN_ROOT;
    }
    await this.logOutService.logOutAllDevice(req.user);
    res.cookie('access_token_cms', '', {
      ...option,
    });
    res.cookie('refresh_token_cms', '', {
      ...option,
    });
    return res.send({ status: 200 });
  }
}
