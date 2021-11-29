import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateGradingAssignmentDto,
  GradingAssignmentInterface,
} from 'src/interfaces';
import { GradingAssignmentRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class GradingAssignmentService {
  constructor(
    private _gradingAssignmentRepository: GradingAssignmentRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createGradingAssignment(
    data: CreateGradingAssignmentDto,
    classId: string,
  ) {
    try {
      let dataAssignment: GradingAssignmentInterface = {
        assignment_id: data.assignment_id,
        class_id: classId,
        student_id: data.student_id,
        mark: data.mark || null,
      };
      const createAssignment = new this._gradingAssignmentRepository._model(
        dataAssignment,
      );
      let assignment = await this._gradingAssignmentRepository.create(
        createAssignment,
      );
      return assignment;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradingAssignmentService');
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

  onCreate() {}
}
