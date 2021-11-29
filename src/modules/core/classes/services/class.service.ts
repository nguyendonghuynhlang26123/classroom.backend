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
import { UserService } from '../../users/services/user.service';
import { MailService } from 'src/modules/feature/mail/mail.service';

@Injectable()
export class ClassService {
  subscription: Subscription = new Subscription();
  constructor(
    private _classRepository: ClassRepository,
    private _userService: UserService,
    private _mailService: MailService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createClass(data: CreateClassDto, userId: string) {
    try {
      let dataClass: ClassInterface = {
        title: data.title,
        section: data.section,
        subject: data.subject || null,
        room: data.room || null,
        image: 'https://gstatic.com/classroom/themes/img_backtoschool.jpg',
        code: Math.random().toString(36).substr(2, 6),
        users: [],
      };
      let teacher: ClassroomUserInterface = {
        user_id: userId,
        status: 'ACTIVATED',
        role: 'ADMIN',
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
          { users: { $elemMatch: { user_id: userId, status: 'ACTIVATED' } } },
          {
            users: 0,
            __v: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._classRepository.getCountPage(
          { users: { $elemMatch: { user_id: userId, status: 'ACTIVATED' } } },
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

  async getClassById(classId: string, userId: string) {
    try {
      let classes = await this._classRepository.getOneDocument({
        _id: classId,
        users: { $elemMatch: { user_id: userId, status: 'ACTIVATED' } },
      });
      if (!classes) {
        throw new HttpException('Not Found Class', HttpStatus.NOT_FOUND);
      }
      delete classes.users;
      return classes;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getRoleUser(classId: string, userId: string) {
    try {
      let classes = await this._classRepository.getOneDocument({
        _id: classId,
      });
      if (!classes) {
        throw new HttpException('Not Found Class', HttpStatus.NOT_FOUND);
      }
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        class_id: classId,
        user_id: userId,
        role: classes.users[index].role,
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getClassPeopleById(classId: string, userId: string) {
    try {
      let classes = await this._classRepository
        .getOneDocument({
          _id: classId,
          users: { $elemMatch: { user_id: userId, status: 'ACTIVATED' } },
        })
        .populate('users.user_id');
      if (!classes) {
        throw new HttpException('Not Found Class', HttpStatus.NOT_FOUND);
      }
      let users = classes.users;
      for (let i = 0; i < users.length; i++) {
        delete users[i].invite_code;
      }
      return { users: users };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async inviteUser(
    classId: string,
    teacherId: string,
    email: string,
    role: 'TEACHER' | 'STUDENT',
  ) {
    try {
      let classes = await this._classRepository.getOneDocument({
        _id: classId,
      });
      let inviter = await this._userService.findUserById(teacherId);
      let index = classes.users.findIndex((e) => {
        return e.user_id == teacherId;
      });
      if (
        index == -1 ||
        (classes.users[index].role != 'TEACHER' &&
          classes.users[index].role != 'ADMIN')
      ) {
        throw new HttpException('Not Acceptable', HttpStatus.NOT_ACCEPTABLE);
      }
      let user = await this._userService.findUserByEmail(email);
      if (
        classes.users.findIndex((e) => {
          return e.user_id == String(user._id);
        }) != -1
      ) {
        throw new HttpException('Duplicated', HttpStatus.CONFLICT);
      }
      let userClassroom: ClassroomUserInterface = {
        user_id: user._id,
        status: 'INACTIVATED',
        role: role,
        invite_code: Math.random().toString(36).substr(2, 6),
      };
      classes.users.push(userClassroom);
      this._classRepository.updateDocument(
        { _id: classId },
        { users: classes.users },
      );
      this._mailService.sendMail(
        email,
        classId,
        role,
        classes.code,
        userClassroom.invite_code,
        inviter.first_name + ' ' + inviter.last_name,
        inviter.email,
        classes.title,
      );
      return { status: 200 };
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

  async acceptInviteUser(
    classId: string,
    userId: string,
    role: 'TEACHER' | 'STUDENT',
    code: string,
  ) {
    try {
      let classes = await this._classRepository.getOneDocument({
        _id: classId,
      });
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      if (classes.users[index].role != role) {
        throw new HttpException('Conflict', HttpStatus.CONFLICT);
      }
      if (
        classes.code != code.substr(0, 6) ||
        classes.users[index].invite_code != code.substr(6, 6)
      ) {
        throw new HttpException('Invalid Code', HttpStatus.NOT_IMPLEMENTED);
      }
      classes.users[index].status = 'ACTIVATED';
      const result = await this._classRepository.updateDocument(
        { _id: classId },
        { users: classes.users },
      );
      return { status: 200 };
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

  async userJoinClass(
    userId: string,
    role: 'TEACHER' | 'STUDENT',
    code: string,
  ) {
    try {
      let classes = await this._classRepository.getOneDocument({
        code: code.substr(0, 6),
      });
      if (!classes) {
        throw new HttpException('Not Found Class', HttpStatus.NOT_FOUND);
      }
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (role == 'TEACHER') {
        if (index == -1) {
          throw new HttpException(
            'Not Found User In Class',
            HttpStatus.NOT_FOUND,
          );
        }
        if (
          classes.code != code.substr(0, 6) ||
          classes.users[index].invite_code != code.substr(6, 6)
        ) {
          throw new HttpException('Invalid Code', HttpStatus.NOT_IMPLEMENTED);
        }
        classes.users[index].status = 'ACTIVATED';
        await this._classRepository.updateDocument(
          { _id: classes._id },
          { users: classes.users },
        );
        return { status: 200 };
      }

      if (role == 'STUDENT') {
        if (index != -1) {
          if (classes.code != code.substr(0, 6)) {
            throw new HttpException('Invalid Code', HttpStatus.NOT_IMPLEMENTED);
          }
          classes.users[index].status = 'ACTIVATED';
          await this._classRepository.updateDocument(
            { _id: classes._id },
            { users: classes.users },
          );
          return { status: 200 };
        }
        let userClassroom: ClassroomUserInterface = {
          user_id: userId,
          status: 'ACTIVATED',
          role: 'STUDENT',
          invite_code: null,
        };
        classes.users.push(userClassroom);
        await this._classRepository.updateDocument(
          { _id: classes._id },
          { users: classes.users },
        );
        return { status: 200 };
      }
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

  async userLeaveClass(classId: string, userId: string) {
    try {
      let classes = await this._classRepository.getOneDocument({
        _id: classId,
      });
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      if (classes.users[index].role == 'ADMIN') {
        throw new HttpException(
          'Admin Can Not Leave Class',
          HttpStatus.BAD_REQUEST,
        );
      }
      classes.users = classes.users.filter((e) => {
        return e.user_id != userId;
      });
      const result = await this._classRepository.updateDocument(
        { _id: classId },
        { users: classes.users },
      );
      return { status: 200 };
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

  async deleteClass(classId: string, userId: string) {
    try {
      const classes = await this._classRepository.getOneDocument({
        _id: classId,
      });
      if (!classes) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      if (classes.users[index].role != 'ADMIN') {
        throw new HttpException(
          'Only Admin Can Delete Class',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const result = this._classRepository.deleteDocument({
        _id: classId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async restoreClass(classId: string, userId: string) {
    try {
      const classes = await this._classRepository.getOneDocumentTrash({
        _id: classId,
      });
      if (!classes) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      if (classes.users[index].role != 'ADMIN') {
        throw new HttpException(
          'Only Admin Can Restore Class',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const result = this._classRepository.restoreDocument({
        _id: classId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async removeClass(classId: string, userId: string) {
    try {
      const classes = await this._classRepository.getOneDocumentTrash({
        _id: classId,
      });
      if (!classes) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      let index = classes.users.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      if (classes.users[index].role != 'ADMIN') {
        throw new HttpException(
          'Only Admin Can Remove Class',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const result = this._classRepository.removeDocument({
        _id: classId,
      });
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findByClassId(classId: string) {
    try {
      let classes = await this._classRepository.getOneDocument({
        _id: classId,
      });
      if (!classes) {
        throw new HttpException('Not Found Class', HttpStatus.NOT_FOUND);
      }
      return classes;
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
