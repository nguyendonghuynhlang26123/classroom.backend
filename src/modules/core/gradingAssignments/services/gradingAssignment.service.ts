import {
  Injectable,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
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
import { ActivityStreamService } from '../../activityStreams/services/activityStream.service';
import { NotificationService } from '../../notifications/services/notification.service';
// const { Parse } = require('json2csv');

@Injectable()
export class GradingAssignmentService {
  constructor(
    private _gradingAssignmentRepository: GradingAssignmentRepository,
    private _classService: ClassService,
    private _assignmentService: AssignmentService,
    private _importCsvService: ImportCsvService,
    private _activityStreamService: ActivityStreamService,
    private _notificationService: NotificationService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createGradingAssignment(
    data: CreateGradingAssignmentDto,
    classId: string,
  ) {
    try {
      const dataGrading: GradingAssignmentInterface = {
        class_id: classId,
        assignment_id: data.assignment_id,
        student_id: data.student_id,
        mark: data.mark || null,
        status: 'DRAFT',
        reviews: [],
      };
      const createGrading = new this._gradingAssignmentRepository._model(
        dataGrading,
      );
      let grading = await this._gradingAssignmentRepository.create(
        createGrading,
      );
      return grading;
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
          status: 'DRAFT',
          reviews: [],
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
    data: UpdateGradingAssignmentDto,
    classId: string,
  ) {
    try {
      const grading = await this._gradingAssignmentRepository.getOneDocument({
        class_id: classId,
        assignment_id: data.assignment_id,
        student_id: data.student_id,
      });
      if (!grading) {
        throw new HttpException(
          `Not Found Grading: class_id=${classId} assignment_id=${data.assignment_id} student_id=${data.student_id}`,
          HttpStatus.NOT_FOUND,
        );
      }
      let result = await this._gradingAssignmentRepository.updateDocument(
        { _id: grading._id },
        { mark: data.mark },
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

  async updateMark(gradingAssignmentId: string, mark: number) {
    try {
      const grading = await this._gradingAssignmentRepository.getOneDocument({
        _id: gradingAssignmentId,
      });
      if (!grading) {
        throw new HttpException(
          `Not Found Grading Assignment`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      let result = await this._gradingAssignmentRepository.updateDocument(
        { _id: grading._id },
        { mark: mark },
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

  async updateStatus(
    classId: string,
    assignmentId: string,
    userId: string,
    username: string,
  ) {
    try {
      const listGrading =
        await this._gradingAssignmentRepository.getAllResource(
          {
            class_id: classId,
            assignment_id: assignmentId,
          },
          { _id: 1 },
        );
      let arrayId = [];
      for (let i = 0; i < listGrading.length; i++) {
        const e = listGrading[i];
        arrayId.push(e._id);
      }
      let result = await this._gradingAssignmentRepository.updateAllDocument(
        { _id: arrayId },
        { status: 'FINAL' },
      );
      let listUser = await this._classService.getStudentInClass(classId);
      this._assignmentService
        .getAssignmentById(assignmentId, classId)
        .then((e) => {
          this._activityStreamService.createActivityStream({
            class_id: classId,
            type: 'GRADING_FINALIZED',
            description: `${username} published gradings for ${e.title}`,
            actor: userId,
            assignment_id: assignmentId,
          });
          this._notificationService.createNotification({
            class_id: classId,
            for: listUser.list_user,
            type: 'GRADE_FINALIZE',
            description: `${username} published grading for assignment: ${e.title}`,
            actor_id: userId,
            assignment: assignmentId,
            grading: null,
          });
        });
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

  async updateReviews(gradingAssignmentId: string, reviewId: string) {
    try {
      let grading = await this._gradingAssignmentRepository.getOneDocument({
        _id: gradingAssignmentId,
      });
      if (!grading) {
        throw new HttpException(
          'Not Found Grading Assignment',
          HttpStatus.NOT_FOUND,
        );
      }
      grading.reviews.push(reviewId);
      let result = await this._gradingAssignmentRepository.updateDocument(
        {
          _id: grading._id,
        },
        { reviews: grading.reviews },
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
          { class_id: classId, student_id: studentId, status: 'FINAL' },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._gradingAssignmentRepository.getCountPage(
          { class_id: classId, student_id: studentId, status: 'FINAL' },
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

  async getFinalGrading(
    classId: string,
    studentId: string,
    assignmentId: string,
  ) {
    try {
      const grading = await this._gradingAssignmentRepository.getOneDocument({
        class_id: classId,
        student_id: studentId,
        assignment_id: assignmentId,
      });
      if (!grading) {
        throw new HttpException(
          'Not Found Grading Assignment',
          HttpStatus.NOT_FOUND,
        );
      }
      if (grading.status != 'FINAL') {
        throw new HttpException(
          'Not Final Grading Assignment',
          HttpStatus.BAD_REQUEST,
        );
      }
      return grading;
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
