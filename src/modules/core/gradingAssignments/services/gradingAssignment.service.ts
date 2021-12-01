import {
  Injectable,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  CreateArrayGradingDto,
  CreateGradingAssignmentDto,
  GenericQuery,
  GenericRes,
  GradingAssignmentInterface,
  UpdateGradingAssignmentDto,
} from 'src/interfaces';
import { ImportCsvService } from 'src/modules/feature/importCsv/services/importCsv.service';
import { GradingAssignmentRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { AssignmentService } from '../../assignments/services/assignment.service';
import { ClassService } from '../../classes/services/class.service';
import { Parser } from 'json2csv';
// const { Parse } = require('json2csv');

@Injectable()
export class GradingAssignmentService {
  constructor(
    private _gradingAssignmentRepository: GradingAssignmentRepository,
    private _classService: ClassService,
    private _assignmentService: AssignmentService,
    private _importCsvService: ImportCsvService,
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

  async createGradingAssignmentByFile(
    file,
    classId: string,
    assignmentId: string,
  ) {
    try {
      if (file == null) {
        throw new HttpException(
          'Csv File Cannot Empty',
          HttpStatus.BAD_REQUEST,
        );
      }
      const check = await Promise.all([
        this._classService.findByClassId(classId),
        this._assignmentService.getAssignmentById(assignmentId, classId),
      ]);
      if (!check[0]) {
        throw new HttpException('Invalid Class Id', HttpStatus.BAD_REQUEST);
      }
      if (!check[1]) {
        throw new HttpException(
          'Invalid Assignment Id',
          HttpStatus.BAD_REQUEST,
        );
      }
      let listGrading = await this._importCsvService.importFile(file.path);
      for (let i = 0; i < listGrading.length; i++) {
        const e = listGrading[i];
        let grading: GradingAssignmentInterface = {
          assignment_id: assignmentId,
          class_id: classId,
          student_id: e.student_id,
          mark: e.mark != '' ? e.mark : null,
        };
        const createGrading =
          await this._gradingAssignmentRepository.replaceDocument(
            {
              assignment_id: grading.assignment_id,
              class_id: grading.class_id,
              student_id: grading.student_id,
            },
            grading,
          );
      }
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

  async updateGradingAssignment(
    data: UpdateGradingAssignmentDto[],
    classId: string,
  ) {
    try {
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        const grading = await this._gradingAssignmentRepository.getOneDocument({
          class_id: classId,
          assignment_id: e.assignment_id,
          student_id: e.student_id,
        });
        if (!grading) {
          throw new HttpException(
            `Not Found Grading: class_id=${classId} assignment_id=${e.assignment_id} student_id=${e.student_id}`,
            HttpStatus.NOT_FOUND,
          );
        }
        await this._gradingAssignmentRepository.updateDocument(
          { _id: grading._id },
          { mark: e.mark },
        );
      }
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

  async exportMark(classId: string, assignmentId: string) {
    try {
      const gradingAssignments =
        await this._gradingAssignmentRepository.getAllDocument(
          { class_id: classId, assignment_id: assignmentId },
          { student_id: 1, mark: 1 },
        );
      gradingAssignments.map((e) => {
        delete e._id;
      });
      const fields = ['student_id', 'mark'];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(gradingAssignments);
      return csv;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradingAssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code == 11000 || error.code == 11001) {
        throw new HttpException(
          `Duplicate key error collection: ${Object.keys(error.keyValue)}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  onCreate() {}
}
