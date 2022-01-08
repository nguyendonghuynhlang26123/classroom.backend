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
  UploadedFile,
} from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from 'src/decorators';
import { UploadFileService } from 'src/modules/feature/uploadFiles/uploadFile.service';
import { RolesGuard } from '../../auth/guard/role.guard';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import {
  AdminQuery,
  GenericRes,
  AdminInterface,
  ParamAdminDto,
  CreateAdminDto,
  UpdateAdminDto,
  UserInterface,
  ParamUserDto,
  UpdateUserDTO,
  ClassInterface,
  QueryClassDto,
  UpdateClassDto,
} from 'src/interfaces';

@Controller('v1/admin')
@ApiTags('Admins')
@UseInterceptors(CacheInterceptor)
export class AdminControllerV1 {
  constructor(
    private adminService: AdminService,
    private uploadFileService: UploadFileService,
  ) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get('admin-accounts')
  async getAllService(
    @Query() query: AdminQuery,
  ): Promise<HttpException | GenericRes<AdminInterface>> {
    return await this.adminService.getAllAdmin(query);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get('user-accounts')
  async getAllAccountService(
    @Query() query: AdminQuery,
    @Req() req,
  ): Promise<HttpException | GenericRes<UserInterface>> {
    return await this.adminService.getAllUserAccount(query);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get('classrooms')
  async getAllClassService(
    @Query() query: AdminQuery,
  ): Promise<HttpException | GenericRes<ClassInterface>> {
    return await this.adminService.getAllClass(query);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get('admin-accounts/:admin_id')
  async findOneService(@Param() param: ParamAdminDto) {
    return await this.adminService.findAdminById(param.admin_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get('user-accounts/:user_id')
  async findOneAccountService(@Param() param: ParamUserDto, @Req() req) {
    return await this.adminService.findUserById(param.user_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Get('classrooms/:class_id')
  async findOneClassService(@Param() param: QueryClassDto) {
    return await this.adminService.findClassroomById(param.class_id);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Post('admin-accounts')
  async createService(@Body() body: CreateAdminDto) {
    return await this.adminService.createAdmin(body);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Put('admin-accounts/:admin_id')
  async updateService(
    @Param() param: ParamAdminDto,
    @Body() body: UpdateAdminDto,
  ) {
    return await this.adminService.updateAdmin(param.admin_id, body);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Put('user-accounts/:user_id')
  async updateAccountService(
    @Param() param: ParamUserDto,
    @Body() body: UpdateUserDTO,
    @Req() req,
  ) {
    return await this.adminService.updateUserAccount(param.user_id, body);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Put('classroom/:class_id')
  async updateClassroomService(
    @Param() param: QueryClassDto,
    @Body() body: UpdateClassDto,
    @Req() req,
  ) {
    return await this.adminService.updateClassroom(param.class_id, body);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  @Post('/upload')
  async uploadAvatar(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    if (!file) {
      return res.status(400).send('Error: No files found');
    }
    let data = await this.uploadFileService.uploadImageKit(file);
    return res.status(200).send(data);
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @Delete('admin-accounts/:admin_id')
  async deleteService(@Param() param: ParamAdminDto) {
    return await this.adminService.deleteAdmin(param.admin_id);
  }
}
