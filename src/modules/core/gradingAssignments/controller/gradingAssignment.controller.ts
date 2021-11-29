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
import { GradingAssignmentService } from '../services/gradingAssignment.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { GradingAssignment } from '../../../connector/repository';
import {
  QueryClassDto,
  CreateGradingAssignmentDto,
  GenericQuery,
  GenericRes,
  GradingAssignmentInterface,
  QueryGradingStudentDto,
  QueryGradingAssignmentDto,
  CreateArrayGradingDto,
  UpdateArrayGradingDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/classes')
@ApiTags('Grading Assignments')
@UseInterceptors(CacheInterceptor)
export class GradingAssignmentControllerV1 {
  constructor(private _gradingAssignmentService: GradingAssignmentService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Post('/:class_id/grading')
  async createService(
    @Param() param: QueryClassDto,
    @Body() body: CreateArrayGradingDto,
  ) {
    return await this._gradingAssignmentService.createGradingAssignment(
      body.data,
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
  @Put('/:class_id/grading')
  async updateService(
    @Param() param: QueryClassDto,
    @Body() body: UpdateArrayGradingDto,
  ) {
    return await this._gradingAssignmentService.updateGradingAssignment(
      body.data,
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
  @Get('/:class_id/grading')
  async getAllService(
    @Query() query: GenericQuery,
    @Param() param: QueryClassDto,
  ): Promise<HttpException | GenericRes<GradingAssignmentInterface>> {
    return await this._gradingAssignmentService.getAllGradingAssignment(
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
  @AllowFors(Role.Admin, Role.Teacher, Role.Student)
  @Get('/:class_id/grading/student/:student_id')
  async getAllServiceByStudentId(
    @Query() query: GenericQuery,
    @Param() param: QueryGradingStudentDto,
  ): Promise<HttpException | GenericRes<GradingAssignmentInterface>> {
    return await this._gradingAssignmentService.getAllGradingByStudentId(
      query,
      param.class_id,
      param.student_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher, Role.Student)
  @Get('/:class_id/grading/assignment/:assignment_id')
  async getAllServiceBAssignmentId(
    @Query() query: GenericQuery,
    @Param() param: QueryGradingAssignmentDto,
  ): Promise<HttpException | GenericRes<GradingAssignmentInterface>> {
    return await this._gradingAssignmentService.getAllGradingByAssignmentId(
      query,
      param.class_id,
      param.assignment_id,
    );
  }
}
