import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  Param,
  UseGuards,
  Request,
  Put,
  Delete,
  UseInterceptors,
  CacheInterceptor,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { User } from '../../../connector/repository';
import {
  UserInterface,
  GenericQuery,
  GenericRes,
  UpdateUserDTO,
  ChangePassDTO,
  ParamUserDto,
} from 'src/interfaces';

@Controller('v1/users')
@ApiTags('Users')
@UseInterceptors(CacheInterceptor)
export class UserControllerV1 {
  constructor(private userService: UserService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllService(
    @Query() query: GenericQuery,
  ): Promise<HttpException | GenericRes<UserInterface>> {
    return await this.userService.getAllUser(query);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':user_id')
  async getServiceById(@Param() param: { user_id: string }) {
    const user: User = <User>await this.userService.findUserById(param.user_id);
    return user;
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':user_id/changePass')
  async changePassService(
    @Request() req,
    @Param() param: { user_id: string },
    @Body() pass: ChangePassDTO,
  ) {
    return await this.userService.changePass(req.user._id, param.user_id, pass);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':user_id')
  updateUserInfo(
    @Req() req,
    @Body() data: UpdateUserDTO,
    @Param() { user_id },
  ) {
    return this.userService
      .updateUser(req.user._id, user_id, data)
      .then((d) => d)
      .catch((e) => {
        throw e;
      });
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':user_id')
  async deleteService(@Request() req, @Param() param: { user_id: string }) {
    return await this.userService.deleteUser(req.user, param.user_id);
  }
}
