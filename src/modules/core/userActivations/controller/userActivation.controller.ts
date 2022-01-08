import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  UseGuards,
  UseInterceptors,
  CacheInterceptor,
  Query,
  Req,
  Put,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserActivationService } from '../services/userActivation.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  UserActivationInterface,
  GenericQuery,
  GenericRes,
  QueryClassDto,
  ParamUserDto,
  ActivateDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/users')
@ApiTags('User Activations')
@UseInterceptors(CacheInterceptor)
export class UserActivationControllerV1 {
  constructor(private _userActivationService: UserActivationService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:user_id/send-activation')
  async createService(@Param() param: ParamUserDto) {
    return await this._userActivationService.createUserActivation(
      param.user_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:user_id/activate')
  async activateService(
    @Param() param: ParamUserDto,
    @Body() body: ActivateDto,
  ) {
    return await this._userActivationService.activateUser(
      param.user_id,
      body.activate_code,
    );
  }
}
