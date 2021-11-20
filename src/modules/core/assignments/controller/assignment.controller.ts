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
import { AssignmentService } from '../services/assignment.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Assignment } from '../../../connector/repository';
import {
  AssignmentInterface,
  GenericQuery,
  GenericRes,
  CreateAssignmentDto,
  QueryAssignmentDto,
  QueryClassDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/classes')
@ApiTags('Assignmentes')
@UseInterceptors(CacheInterceptor)
export class AssignmentControllerV1 {
  constructor(private _assignmentService: AssignmentService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher, Role.Student)
  @Get('/:class_id/assignments')
  async getAllService(
    @Query() query: GenericQuery,
    @Param() param: QueryClassDto,
  ): Promise<HttpException | GenericRes<AssignmentInterface>> {
    return await this._assignmentService.getAllAssignment(
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
  @Post('/:class_id/assignments')
  async createService(
    @Param() param: QueryClassDto,
    @Body() body: CreateAssignmentDto,
  ): Promise<HttpException | Assignment> {
    return await this._assignmentService.createAssignment(body);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Put('/:class_id/assignments/:assignment_id')
  async updateService(
    @Param() param: QueryAssignmentDto,
    @Body() body: AssignmentInterface,
  ) {
    return await this._assignmentService.updateAssignment(
      param.assignment_id,
      body,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Patch('/:class_id/assignments/:assignment_id/restore')
  async restoreService(@Param() param: QueryAssignmentDto) {
    return await this._assignmentService.restoreAssignment(param.assignment_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Delete('/:class_id/assignments/:assignment_id/delete')
  async deleteService(@Param() param: QueryAssignmentDto) {
    return await this._assignmentService.deleteAssignment(param.class_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Delete('/:class_id/assignments/:assignment_id/remove')
  async removeService(@Param() param: QueryAssignmentDto) {
    return await this._assignmentService.removeAssignment(param.class_id);
  }
}
