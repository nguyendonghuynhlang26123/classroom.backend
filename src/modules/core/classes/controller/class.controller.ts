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
import { ClassService } from '../services/class.service';
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
  UpdateClassDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

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
    return await this._classService.createClass(body, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher)
  @Put(':class_id')
  async updateService(
    @Param() param: QueryClassDto,
    @Req() req,
    @Body() body: UpdateClassDto,
  ) {
    return await this._classService.updateClassById(
      param.class_id,
      body,
      req.user._id,
      req.user.name,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':class_id')
  async getServiceById(
    @Req() req,
    @Param() param: QueryClassDto,
  ): Promise<HttpException | ClassInterface> {
    return await this._classService.getClassById(param.class_id, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':class_id/role/')
  async getRoleService(@Req() req, @Param() param: QueryClassDto) {
    return await this._classService.getRoleUser(param.class_id, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:class_id/people')
  async getPeopleServiceById(@Req() req, @Param() param: QueryClassDto) {
    return await this._classService.getClassPeopleById(
      param.class_id,
      req.user._id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('invite/')
  async inviteService(@Req() req, @Body() body: InviteUserDto) {
    return await this._classService.inviteUser(
      body.class_id,
      req.user._id,
      body.email,
      body.role,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('invite/accept')
  async acceptInviteService(@Req() req, @Body() body: AcceptInviteUserDto) {
    return await this._classService.acceptInviteUser(
      body.class_id,
      req.user._id,
      body.role,
      body.code,
      req.user.name,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('join')
  async joinService(@Req() req, @Body() body: UserJoinClassDto) {
    return await this._classService.userJoinClass(
      req.user._id,
      body.role,
      body.code,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':class_id/leave')
  async leaveService(@Req() req, @Param() param: QueryClassDto) {
    return await this._classService.userLeaveClass(
      param.class_id,
      req.user._id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/:class_id/restore')
  async restoreService(@Req() req, @Param() param: QueryClassDto) {
    return await this._classService.restoreClass(param.class_id, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:class_id/delete')
  async deleteService(@Req() req, @Param() param: QueryClassDto) {
    return await this._classService.deleteClass(param.class_id, req.user._id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:class_id/remove')
  async removeService(@Req() req, @Param() param: QueryClassDto) {
    return await this._classService.removeClass(param.class_id, req.user._id);
  }
}
