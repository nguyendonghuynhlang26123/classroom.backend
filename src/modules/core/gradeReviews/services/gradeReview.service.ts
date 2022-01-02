import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  GradeReviewInterface,
  GenericRes,
  GenericQuery,
  GradeReviewQuery,
} from 'src/interfaces';
import { GradeReviewRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { ClassService } from '../../classes/services/class.service';

@Injectable()
export class GradeReviewService {
  constructor(
    private _gradeReviewRepository: GradeReviewRepository,
    private _classService: ClassService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async getAllGradeReview(query: GradeReviewQuery, classId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      let filter = {};
      if (query.status) {
        filter['status'] = query.status;
      }
      const data = await Promise.all([
        this._gradeReviewRepository
          .getAllDocument(
            { class_id: classId, ...filter },
            {
              __v: 0,
            },
            builder,
            Number(query.per_page),
            Number(query.page),
          )
          .populate('comments.author'),
        this._gradeReviewRepository.getCountPage(
          { class_id: classId, ...filter },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<GradeReviewInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradeReviewService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getGradeReviewById(
    classId: string,
    gradeReviewId: string,
    userId: string,
  ) {
    try {
      const gradeReview = await this._gradeReviewRepository.getOneDocument({
        class_id: classId,
        _id: gradeReviewId,
      });
      if (!gradeReview) {
        throw new HttpException('Not Found Grade Review', HttpStatus.NOT_FOUND);
      }
      const check = await this._classService.getRoleUser(classId, userId);
      if (check.role == 'STUDENT' && gradeReview.student_account != userId) {
        throw new HttpException(
          'Student Account Does Not Match',
          HttpStatus.FORBIDDEN,
        );
      }
      return gradeReview;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradeReviewService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
