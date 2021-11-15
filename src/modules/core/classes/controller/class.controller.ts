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
} from '@nestjs/common';
import { ClassService } from '../services/class.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Class } from '../../../connector/repository';
import {
  ClassInterface,
  GenericQuery,
  GenericRes,
  CreateClassDto,
} from 'src/interfaces';

@Controller('v1/classes')
@ApiTags('Classes')
@UseInterceptors(CacheInterceptor)
export class ClassControllerV1 {
  constructor(private _classService: ClassService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllService(
    @Req() req,
    @Query() query: GenericQuery,
  ): Promise<HttpException | GenericRes<ClassInterface>> {
    return await this._classService.getAllClass(query, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createService(
    @Req() req,
    @Body() body: CreateClassDto,
  ): Promise<HttpException | Class> {
    // console.log(req.user);
    return await this._classService.createClass(body, req.user._id);
  }
}
