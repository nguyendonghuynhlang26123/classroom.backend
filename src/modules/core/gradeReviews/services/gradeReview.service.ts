import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  GradeReviewInterface,
  GenericRes,
  GenericQuery,
  GradeReviewQuery,
} from 'src/interfaces';
import { GradeReviewRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class GradeReviewService {
  constructor(
    private _gradeReviewRepository: GradeReviewRepository,
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

  onCreate() {}
}
