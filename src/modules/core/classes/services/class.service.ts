import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ClassInterface,
  GenericRes,
  GenericQuery,
  CreateClassDto,
  ClassroomUserInterface,
} from 'src/interfaces';
import { Subscription } from 'rxjs';
import { ClassRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class ClassService {
  subscription: Subscription = new Subscription();
  constructor(
    private _classRepository: ClassRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createClass(data: CreateClassDto, userId: string) {
    try {
      let dataClass: ClassInterface = {
        title: data.title,
        section: data.section,
        subject: data.subject,
        room: data.room,
        image: 'https://www.gstatic.com/classroom/themes/img_breakfast.jpg',
        code: Math.random().toString(36).substr(2, 6),
        users: [],
      };
      let teacher: ClassroomUserInterface = {
        user_id: userId,
        status: 'ACTIVATED',
        role: 'TEACHER',
        invite_code: Math.random().toString(36).substr(2, 6),
      };
      dataClass.users.push(teacher);
      const createClass = new this._classRepository._model(dataClass);
      let classes = await this._classRepository.create(createClass);
      return classes;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
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

  async getAllClass(query: GenericQuery, userId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._classRepository.getAllDocument(
          { 'users.user_id': userId },
          {
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._classRepository.getCountPage(
          { 'users.user_id': userId },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<ClassInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
