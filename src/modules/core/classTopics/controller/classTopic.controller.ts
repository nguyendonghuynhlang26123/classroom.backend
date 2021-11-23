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
import { ClassTopicService } from '../services/classTopic.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { ClassTopic } from '../../../connector/repository';
import {
  ClassTopicInterface,
  GenericQuery,
  GenericRes,
  CreateClassTopicDto,
  QueryClassTopicDto,
  QueryClassDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/classes')
@ApiTags('Class Topics')
@UseInterceptors(CacheInterceptor)
export class ClassTopicControllerV1 {
  constructor(private _classTopicService: ClassTopicService) {}

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
  ): Promise<HttpException | GenericRes<ClassTopicInterface>> {
    return await this._classTopicService.getAllClassTopic(
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
    @Body() body: CreateClassTopicDto,
  ): Promise<HttpException | ClassTopic> {
    return await this._classTopicService.createClassTopic(body, param.class_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Patch('/:class_id/class-topics/:class_topic_id/restore')
  async restoreService(@Param() param: QueryClassTopicDto) {
    return await this._classTopicService.restoreClassTopic(param.class_topic_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Delete('/:class_id/class-topics/:class_topic_id/delete')
  async deleteService(@Param() param: QueryClassTopicDto) {
    return await this._classTopicService.deleteClassTopic(param.class_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher)
  @Delete('/:class_id/class-topics/:class_topic_id/remove')
  async removeService(@Param() param: QueryClassTopicDto) {
    return await this._classTopicService.removeClassTopic(param.class_id);
  }
}
