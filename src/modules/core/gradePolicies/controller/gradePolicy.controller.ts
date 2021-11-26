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
import { GradePolicyService } from '../services/gradePolicy.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { GradePolicy } from '../../../connector/repository';
import {
  GradePolicyInterface,
  GenericQuery,
  GenericRes,
  CreateGradePolicyDto,
  QueryGradePolicyDto,
  QueryClassDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/classes')
@ApiTags('Class Topics')
@UseInterceptors(CacheInterceptor)
export class GradePolicyControllerV1 {
  constructor(private _gradePolicyService: GradePolicyService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher, Role.Student)
  @Get('/:class_id/class-topics')
  async getAllService(
    @Query() query: GenericQuery,
    @Param() param: QueryClassDto,
  ): Promise<HttpException | GenericRes<GradePolicyInterface>> {
    return await this._gradePolicyService.getAllGradePolicy(
      query,
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Post('/:class_id/class-topics')
  async createService(
    @Param() param: QueryClassDto,
    @Body() body: CreateGradePolicyDto,
  ): Promise<HttpException | GradePolicy> {
    return await this._gradePolicyService.createGradePolicy(
      body,
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher, Role.Student)
  @Get('/:class_id/class-topics/:class_topic_id')
  async getServiceById(@Param() param: QueryGradePolicyDto) {
    return await this._gradePolicyService.getGradePolicyById(
      param.grade_policy_id,
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Patch('/:class_id/class-topics/:class_topic_id/restore')
  async restoreService(@Param() param: QueryGradePolicyDto) {
    return await this._gradePolicyService.restoreGradePolicy(
      param.grade_policy_id,
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Delete('/:class_id/class-topics/:class_topic_id/delete')
  async deleteService(@Param() param: QueryGradePolicyDto) {
    return await this._gradePolicyService.deleteGradePolicy(
      param.grade_policy_id,
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Delete('/:class_id/class-topics/:class_topic_id/remove')
  async removeService(@Param() param: QueryGradePolicyDto) {
    return await this._gradePolicyService.removeGradePolicy(
      param.grade_policy_id,
      param.class_id,
    );
  }
}
