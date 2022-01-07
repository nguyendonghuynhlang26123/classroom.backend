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
import { BlackListService } from '../services/blackList.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guard/role.guard';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import {
  GenericRes,
  BlackListInterface,
  GenericQuery,
  CreateBlackListDto,
  ParamBlackListDto,
} from 'src/interfaces';

@Controller('v1/admin/blacklist')
@ApiTags('Black Lists')
@UseInterceptors(CacheInterceptor)
export class BlackListControllerV1 {
  constructor(private blackListService: BlackListService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get()
  async getAllService(
    @Query() query: GenericQuery,
  ): Promise<HttpException | GenericRes<BlackListInterface>> {
    return await this.blackListService.getAllBlackList(query);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Post()
  async createService(@Body() body: CreateBlackListDto, @Req() req) {
    return await this.blackListService.createBlackList(body, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Put('/:black_list_id/restore')
  async updateService(@Param() param: ParamBlackListDto) {
    return await this.blackListService.updateBlackListRestore(
      param.black_list_id,
    );
  }
}
