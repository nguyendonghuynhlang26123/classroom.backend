import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  ActivityStreamInterface,
  GenericRes,
  GenericQuery,
} from 'src/interfaces';
import { ActivityStreamRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class ActivityStreamService {
  constructor(
    private _activityStreamRepository: ActivityStreamRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createActivityStream(data: ActivityStreamInterface) {
    try {
      const createActivityStream = new this._activityStreamRepository._model(
        data,
      );
      let activityStream = await this._activityStreamRepository.create(
        createActivityStream,
      );
      return activityStream;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ActivityStreamService');
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

  async getAllActivityStream(query: GenericQuery, classId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._activityStreamRepository
          .getAllDocument(
            { class_id: classId },
            {
              __v: 0,
            },
            builder,
            Number(query.per_page),
            Number(query.page),
          )
          .populate('actor'),
        this._activityStreamRepository.getCountPage(
          { class_id: classId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<ActivityStreamInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ActivityStreamService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
