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
  Res,
} from '@nestjs/common';
import { GradingAssignmentService } from '../services/gradingAssignment.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
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
  CreateGradingByFileDto,
  DownloadQueryDto,
  QueryAssignmentDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';
import { ApiFile } from 'src/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as path from 'path';
import { csvFileFilter } from 'src/utils/csvFilter';

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
  @AllowFors(Role.Owner, Role.Teacher)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher)
  @ApiConsumes('multipart/form-data')
  @ApiFile('csv')
  @UseInterceptors(
    FileInterceptor('csv', {
      storage: diskStorage({
        destination: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}${Math.round(
            Math.random() * 1e9,
          )}`;
          cb(null, join(__dirname, '../../../', '../../public/gradingCsv'));
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
  @Post(':class_id/grading/assignment/:assignment_id/import')
  async createServiceByFile(
    @UploadedFile() file,
    @Param() param: QueryAssignmentDto,
  ) {
    return await this._gradingAssignmentService.createGradingAssignmentByFile(
      file,
      param.class_id,
      param.assignment_id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher)
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
  @AllowFors(Role.Owner, Role.Teacher, Role.Student)
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
  @AllowFors(Role.Owner, Role.Teacher, Role.Student)
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
  @AllowFors(Role.Owner, Role.Teacher, Role.Student)
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

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher, Role.Student)
  @Get(':class_id/grading/assignment/:assignment_id/export')
  async exportFile(@Param() param: QueryAssignmentDto, @Req() req, @Res() res) {
    let result = await this._gradingAssignmentService.exportMark(
      param.class_id,
      param.assignment_id,
    );
    res.attachment('grading.csv');
    res.status(200).send(result);
  }
}
