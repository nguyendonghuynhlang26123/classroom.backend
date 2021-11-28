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
  UploadedFile,
} from '@nestjs/common';
import { ClassStudentService } from '../services/classStudent.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import {
  QueryClassDto,
  QueryClassStudentDto,
  AccountSyncDto,
} from 'src/interfaces';
import { ApiFile } from 'src/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as path from 'path';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { RolesGuard } from '../../auth/guard/role.guard';
import { Role } from 'src/enums';
import { csvFileFilter } from 'src/utils/csvFilter';

@Controller('v1/classes')
@ApiTags('Class Students')
@UseInterceptors(CacheInterceptor)
export class ClassStudentControllerV1 {
  constructor(private _classStudentService: ClassStudentService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiFile('csv')
  @UseInterceptors(
    FileInterceptor('csv', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(null, join(__dirname, '../../../', '../../public/uploadCsv'));
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
      fileFilter: csvFileFilter,
    }),
  )
  @Post(':class_id/students')
  async createService(@UploadedFile() file, @Param() param: QueryClassDto) {
    return await this._classStudentService.createClassStudent(
      file,
      param.class_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @AllowFors(Role.Admin)
  @ApiConsumes('multipart/form-data')
  @ApiFile('csv')
  @UseInterceptors(
    FileInterceptor('csv', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(null, join(__dirname, '../../../', '../../public/uploadCsv'));
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(
            null,
            file.fieldname +
              '-' +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
      fileFilter: csvFileFilter,
    }),
  )
  @Put(':class_id/students')
  async updateService(@UploadedFile() file, @Param() param: QueryClassDto) {
    return await this._classStudentService.updateClassStudent(
      file,
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Admin, Role.Teacher, Role.Student)
  @Get(':class_id/students/:student_id')
  async getServiceByStudentId(@Param() param: QueryClassStudentDto) {
    return await this._classStudentService.getStudentByStudentId(
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
  @Put(':class_id/students/account-sync')
  async syncServiceByStudentId(
    @Param() param: QueryClassDto,
    @Body() body: AccountSyncDto,
  ) {
    return await this._classStudentService.accountSync(
      param.class_id,
      body.student_id,
      body.user_id,
    );
  }
}
