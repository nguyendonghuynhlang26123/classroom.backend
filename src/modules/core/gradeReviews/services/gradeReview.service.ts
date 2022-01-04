import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  GradeReviewInterface,
  GenericRes,
  GenericQuery,
  GradeReviewQuery,
  CreateGradeReviewDto,
} from 'src/interfaces';
import { GradeReviewRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { AssignmentService } from '../../assignments/services/assignment.service';
import { ClassService } from '../../classes/services/class.service';
import { GradingAssignmentService } from '../../gradingAssignments/services/gradingAssignment.service';

@Injectable()
export class GradeReviewService {
  constructor(
    private _gradeReviewRepository: GradeReviewRepository,
    private _classService: ClassService,
    private _assignmentService: AssignmentService,
    private _gradingAssignmentService: GradingAssignmentService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createGradeReview(
    data: CreateGradeReviewDto,
    classId: string,
    userId: string,
  ) {
    try {
      const check = await this._assignmentService.getAssignmentById(
        data.assignment_id,
        classId,
      );
      if (!check) {
        throw new HttpException(
          'Invalid Assignment Id',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (data.expect_mark > check.total_points) {
        throw new HttpException('Invalid Mark', HttpStatus.BAD_REQUEST);
      }
      const grading = await this._gradingAssignmentService.getFinalGrading(
        classId,
        data.student_id,
        data.assignment_id,
      );
      let dataGradeReview: GradeReviewInterface = {
        class_id: classId,
        student_account: userId,
        assignment_id: data.assignment_id,
        grading_id: grading._id,
        expect_mark: data.expect_mark,
        current_mark: grading.mark,
        status: 'OPEN',
        comments: [
          { author: userId, message: data.message, created_at: Date.now() },
        ],
      };
      const createGradeReview = new this._gradeReviewRepository._model(
        dataGradeReview,
      );
      let gradeReview = await this._gradeReviewRepository.create(
        createGradeReview,
      );
      this._gradingAssignmentService.updateReviews(
        grading._id,
        gradeReview._id,
      );
      return gradeReview;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradeReviewService');
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code == 11000 || error.code == 11001) {
        throw new HttpException(
          `Duplicate key error collection: ${Object.keys(error.keyValue)}`,
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
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
      }).populate('comments.author assignment_id grading_id');
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

  async addComment(
    classId: string,
    gradeReviewId: string,
    userId: string,
    message: string,
  ) {
    try {
      let gradeReview = await this._gradeReviewRepository.getOneDocument({
        class_id: classId,
        _id: gradeReviewId,
      });
      if (!gradeReview) {
        throw new HttpException('Not Found Grade Review', HttpStatus.NOT_FOUND);
      }
      if (gradeReview.status != 'OPEN') {
        throw new HttpException('Grade Review Not Open', HttpStatus.CONFLICT);
      }
      const check = await this._classService.getRoleUser(classId, userId);
      if (check.role == 'STUDENT' && gradeReview.student_account != userId) {
        throw new HttpException(
          'Student Account Does Not Match',
          HttpStatus.BAD_REQUEST,
        );
      }
      gradeReview.comments.push({
        author: userId,
        message: message,
        created_at: Date.now(),
      });
      this._gradeReviewRepository.updateDocument(
        {
          _id: gradeReview._id,
        },
        { comments: gradeReview.comments },
      );
      return gradeReview;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradeReviewService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async acceptGradeReview(
    classId: string,
    gradeReviewId: string,
    mark: number,
  ) {
    try {
      let gradeReview = await this._gradeReviewRepository.getOneDocument({
        class_id: classId,
        _id: gradeReviewId,
      });
      if (!gradeReview) {
        throw new HttpException('Not Found Grade Review', HttpStatus.NOT_FOUND);
      }
      this._gradingAssignmentService.updateMark(gradeReview.grading_id, mark);
      gradeReview.comments.push({
        author: null,
        message:
          'Your teacher accepted and updated your grade. This review is marked as APPROVED and no longer available.',
        created_at: Date.now(),
      });
      this._gradeReviewRepository.updateDocument(
        {
          _id: gradeReview._id,
        },
        { status: 'APPROVED', comments: gradeReview.comments },
      );
      return gradeReview;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradeReviewService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async rejectGradeReview(classId: string, gradeReviewId: string) {
    try {
      let gradeReview = await this._gradeReviewRepository.getOneDocument({
        class_id: classId,
        _id: gradeReviewId,
      });
      if (!gradeReview) {
        throw new HttpException('Not Found Grade Review', HttpStatus.NOT_FOUND);
      }
      gradeReview.comments.push({
        author: null,
        message:
          'Your teacher did not approve your grade request. This review is marked as REJECTED and no longer available.',
        created_at: Date.now(),
      });
      this._gradeReviewRepository.updateDocument(
        {
          _id: gradeReview._id,
        },
        { status: 'REJECTED', comments: gradeReview.comments },
      );
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
