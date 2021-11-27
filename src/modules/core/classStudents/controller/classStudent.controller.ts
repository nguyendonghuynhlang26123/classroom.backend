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
import { ClassStudentService } from '../services/classStudent.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Class } from '../../../connector/repository';
import {
  ClassInterface,
  GenericQuery,
  GenericRes,
  CreateClassDto,
  QueryClassDto,
  InviteUserDto,
  AcceptInviteUserDto,
  UserJoinClassDto,
  QueryClassStudentDto,
} from 'src/interfaces';

@Controller('v1/classes')
@ApiTags('Class Students')
@UseInterceptors(CacheInterceptor)
export class ClassStudentControllerV1 {
  constructor(private _classStudentService: ClassStudentService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':class_id/students')
  async getServiceByClassId(@Param() param: QueryClassDto) {
    return await this._classStudentService.getClassStudentByClassId(
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':class_id/students/:student_id')
  async getServiceByStudentId(@Param() param: QueryClassStudentDto) {
    return await this._classStudentService.getStudentByStudentId(
      param.class_id,
      param.student_id,
    );
  }
}
