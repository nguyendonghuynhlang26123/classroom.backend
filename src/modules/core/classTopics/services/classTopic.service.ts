import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ClassTopicInterface,
  GenericRes,
  GenericQuery,
  CreateClassTopicDto,
} from 'src/interfaces';
import { ClassTopicRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class ClassTopicService {
  constructor(
    private _classTopicRepository: ClassTopicRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createClassTopic(data: CreateClassTopicDto, classId: string) {
    try {
      let dataClassTopic: ClassTopicInterface = {
        title: data.title,
        class_id: classId,
      };
      const createClassTopic = new this._classTopicRepository._model(
        dataClassTopic,
      );
      let classTopic = await this._classTopicRepository.create(
        createClassTopic,
      );
      return classTopic;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassTopicService');
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

  async getAllClassTopic(query: GenericQuery, classId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._classTopicRepository.getAllDocument(
          { class_id: classId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._classTopicRepository.getCountPage(
          { class_id: classId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<ClassTopicInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassTopicService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteClassTopic(classTopicId: string) {
    try {
      const classTopic = await this._classTopicRepository.getOneDocument({
        _id: classTopicId,
      });
      if (!classTopic) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      const result = this._classTopicRepository.deleteDocument({
        _id: classTopicId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassTopicService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async restoreClassTopic(classTopicId: string) {
    try {
      const classTopic = await this._classTopicRepository.getOneDocumentTrash({
        _id: classTopicId,
      });
      if (!classTopic) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      const result = this._classTopicRepository.restoreDocument({
        _id: classTopicId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassTopicService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async removeClassTopic(classTopicId: string) {
    try {
      const classTopic = await this._classTopicRepository.getOneDocumentTrash({
        _id: classTopicId,
      });
      if (!classTopic) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      const result = this._classTopicRepository.removeDocument({
        _id: classTopicId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassTopicService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
