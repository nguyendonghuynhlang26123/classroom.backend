import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  AssignmentInterface,
  GenericRes,
  GenericQuery,
  CreateAssignmentDto,
} from 'src/interfaces';
import { AssignmentRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class AssignmentService {
  constructor(
    private _assignmentRepository: AssignmentRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createAssignment(data: CreateAssignmentDto, classId: string) {
    try {
      let dataAssignment: AssignmentInterface = {
        class_id: classId,
        topic: data.topic || null,
        title: data.title,
        instructions: data.instructions,
        total_points: data.total_points || null,
        due_date: data.due_date || null,
        grade_criterias: data.grade_criterias || [],
      };
      const createAssignment = new this._assignmentRepository._model(
        dataAssignment,
      );
      let assignment = await this._assignmentRepository.create(
        createAssignment,
      );
      return assignment;
    } catch (error) {
      this._logUtil.errorLogger(error, 'AssignmentService');
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

  async getAllAssignment(query: GenericQuery, classId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._assignmentRepository.getAllDocument(
          { class_id: classId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._assignmentRepository.getCountPage(
          { class_id: classId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<AssignmentInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async updateAssignment(assignmentId: string, dataUpdate) {
    try {
      let assignment = await this._assignmentRepository.getOneDocument({
        _id: assignmentId,
      });
      if (!assignment) {
        throw new HttpException('Not Found Assignment', HttpStatus.NOT_FOUND);
      }
      let result = await this._assignmentRepository.updateDocument(
        { _id: assignmentId },
        dataUpdate,
      );
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteAssignment(assignmentId: string) {
    try {
      const assignment = await this._assignmentRepository.getOneDocument({
        _id: assignmentId,
      });
      if (!assignment) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      const result = this._assignmentRepository.deleteDocument({
        _id: assignmentId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async restoreAssignment(assignmentId: string) {
    try {
      const assignment = await this._assignmentRepository.getOneDocumentTrash({
        _id: assignmentId,
      });
      if (!assignment) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      const result = this._assignmentRepository.restoreDocument({
        _id: assignmentId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async removeAssignment(assignmentId: string) {
    try {
      const assignment = await this._assignmentRepository.getOneDocumentTrash({
        _id: assignmentId,
      });
      if (!assignment) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      const result = this._assignmentRepository.removeDocument({
        _id: assignmentId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AssignmentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
