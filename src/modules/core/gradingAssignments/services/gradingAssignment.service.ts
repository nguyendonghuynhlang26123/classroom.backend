import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  CreateArrayGradingDto,
  CreateGradingAssignmentDto,
  GenericQuery,
  GenericRes,
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
    data: CreateGradingAssignmentDto[],
    classId: string,
  ) {
    try {
      data.map((e) => {
        e['class_id'] = classId;
      });
      let createGradingAssignments = [];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        const createGrading = new this._gradingAssignmentRepository._model(e);
        createGradingAssignments.push(createGrading);
      }
      let gradingAssignments =
        await this._gradingAssignmentRepository.createWithArray(
          createGradingAssignments,
        );
      return { status: 200 };
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

  async getAllGradingAssignment(query: GenericQuery, classId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        let sortBy = query.sort_by.split(',');
        for (let i = 0; i < sortBy.length; i++) {
          const e = sortBy[i];
          builder[e] = query.sort_type;
        }
      }
      const data = await Promise.all([
        this._gradingAssignmentRepository.getAllDocument(
          { class_id: classId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._gradingAssignmentRepository.getCountPage(
          { class_id: classId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<GradingAssignmentInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradingAssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllGradingByStudentId(
    query: GenericQuery,
    classId: string,
    studentId: string,
  ) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._gradingAssignmentRepository.getAllDocument(
          { class_id: classId, student_id: studentId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._gradingAssignmentRepository.getCountPage(
          { class_id: classId, student_id: studentId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<GradingAssignmentInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradingAssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllGradingByAssignmentId(
    query: GenericQuery,
    classId: string,
    assignmentId: string,
  ) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._gradingAssignmentRepository.getAllDocument(
          { class_id: classId, assignment_id: assignmentId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._gradingAssignmentRepository.getCountPage(
          { class_id: classId, assignment_id: assignmentId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<GradingAssignmentInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradingAssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
