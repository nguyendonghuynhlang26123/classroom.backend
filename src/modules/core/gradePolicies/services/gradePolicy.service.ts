import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  GradePolicyInterface,
  GenericRes,
  GenericQuery,
  CreateGradePolicyDto,
  UpdateGradePolicyDto,
} from 'src/interfaces';
import { GradePolicyRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class GradePolicyService {
  constructor(
    private _gradePolicyRepository: GradePolicyRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createGradePolicy(data: CreateGradePolicyDto[], classId: string) {
    try {
      data.map((e) => {
        e['class_id'] = classId;
      });
      let createGradePolicies = [];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        const createGradePolicy = new this._gradePolicyRepository._model(e);
        createGradePolicies.push(createGradePolicy);
      }
      let gradePolicy = await this._gradePolicyRepository.createWithArray(
        createGradePolicies,
      );
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
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

  async getAllGradePolicy(query: GenericQuery, classId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._gradePolicyRepository.getAllDocument(
          { class_id: classId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._gradePolicyRepository.getCountPage(
          { class_id: classId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<GradePolicyInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getGradePolicyById(gradePolicyId: string, classId: string) {
    try {
      let gradePolicy = await this._gradePolicyRepository.getOneDocument({
        _id: gradePolicyId,
        class_id: classId,
      });
      if (!gradePolicy) {
        throw new HttpException('Not Found Grade Policy', HttpStatus.NOT_FOUND);
      }
      return gradePolicy;
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async updateGradePolicy(
    listId: string[],
    data: UpdateGradePolicyDto[],
    classId: string,
  ) {
    try {
      for (let i = 0; i < listId.length; i++) {
        const id = listId[i];
        const dataUpdate = data[i];
        this._gradePolicyRepository.updateDocument(
          {
            _id: id,
            class_id: classId,
          },
          dataUpdate,
        );
      }
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteGradePolicy(gradePolicyId: string, classId: string) {
    try {
      const gradePolicy = await this._gradePolicyRepository.getOneDocument({
        _id: gradePolicyId,
        class_id: classId,
      });
      if (!gradePolicy) {
        throw new HttpException('Not Found Grade Policy', HttpStatus.NOT_FOUND);
      }
      const result = this._gradePolicyRepository.deleteDocument({
        _id: gradePolicyId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async restoreGradePolicy(gradePolicyId: string, classId: string) {
    try {
      const gradePolicy = await this._gradePolicyRepository.getOneDocumentTrash(
        {
          _id: gradePolicyId,
          class_id: classId,
        },
      );
      if (!gradePolicy) {
        throw new HttpException('Not Found Grade Policy', HttpStatus.NOT_FOUND);
      }
      const result = this._gradePolicyRepository.restoreDocument({
        _id: gradePolicyId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async removeGradePolicy(gradePolicyId: string, classId: string) {
    try {
      const gradePolicy = await this._gradePolicyRepository.getOneDocumentTrash(
        {
          _id: gradePolicyId,
          class_id: classId,
        },
      );
      if (!gradePolicy) {
        throw new HttpException('Not Found Grade Policy', HttpStatus.NOT_FOUND);
      }
      const result = this._gradePolicyRepository.removeDocument({
        _id: gradePolicyId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'GradePolicyService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
