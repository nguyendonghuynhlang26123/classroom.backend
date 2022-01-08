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
import { GradeReviewService } from '../services/gradeReview.service';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  GradeReviewInterface,
  GenericQuery,
  GenericRes,
  QueryClassDto,
  GradeReviewQuery,
  QueryGradeReviewDto,
  CreateGradeReviewDto,
} from 'src/interfaces';
import { AllowFors } from 'src/decorators/allowFors.decorator';
import { Role } from 'src/enums';
import { RolesGuard } from '../../auth/guard/role.guard';

@Controller('v1/classes')
@ApiTags('Grade Reviews')
@UseInterceptors(CacheInterceptor)
export class GradeReviewControllerV1 {
  constructor(private _gradeReviewService: GradeReviewService) {}

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Student)
  @Post('/:class_id/grade-review')
  async createService(
    @Param() param: QueryClassDto,
    @Body() body: CreateGradeReviewDto,
    @Req() req,
  ) {
    return await this._gradeReviewService.createGradeReview(
      body,
      param.class_id,
      req.user._id,
      req.user.name,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher, Role.Student)
  @Post('/:class_id/grade-review/:grade_review_id/comment')
  async addCommentService(
    @Param() param: QueryGradeReviewDto,
    @Body() body: { message: string },
    @Req() req,
  ) {
    return await this._gradeReviewService.addComment(
      param.class_id,
      param.grade_review_id,
      req.user._id,
      body.message,
      req.user.name,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher)
  @Put('/:class_id/grade-review/:grade_review_id/accept')
  async acceptService(
    @Param() param: QueryGradeReviewDto,
    @Body() body: { mark: number },
    @Req() req,
  ) {
    return await this._gradeReviewService.acceptGradeReview(
      param.class_id,
      param.grade_review_id,
      body.mark,
      req.user.name,
      req.user._id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher)
  @Put('/:class_id/grade-review/:grade_review_id/reject')
  async rejectService(@Param() param: QueryGradeReviewDto, @Req() req) {
    return await this._gradeReviewService.rejectGradeReview(
      param.class_id,
      param.grade_review_id,
      req.user.name,
      req.user._id,
    );
  }

  @ApiHeader({
    name: 'XSRF-Token',
    description: 'XSRF-Token',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @AllowFors(Role.Owner, Role.Teacher)
  @Get('/:class_id/grade-review')
  async getAllService(
    @Query() query: GradeReviewQuery,
    @Param() param: QueryClassDto,
  ): Promise<HttpException | GenericRes<GradeReviewInterface>> {
    return await this._gradeReviewService.getAllGradeReview(
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
  @Get('/:class_id/grade-review/:grade_review_id')
  async getServiceById(@Param() param: QueryGradeReviewDto, @Req() req) {
    return await this._gradeReviewService.getGradeReviewById(
      param.class_id,
      param.grade_review_id,
      req.user._id,
    );
  }
}
