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
import { QueryClassDto, CreateGradingAssignmentDto } from 'src/interfaces';
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
    @Body() body: CreateGradingAssignmentDto,
  ): Promise<HttpException | GradingAssignment> {
    return await this._gradingAssignmentService.createGradingAssignment(
      body,
      param.class_id,
    );
  }
}
