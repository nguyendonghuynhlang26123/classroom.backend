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
import {
  ClassRepository,
  ClassStudentRepository,
} from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { UserService } from '../../users/services/user.service';
import { MailService } from 'src/modules/feature/mail/mail.service';

@Injectable()
export class ClassStudentService {
  subscription: Subscription = new Subscription();
  constructor(
    private _classStudentRepository: ClassStudentRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async getClassStudentByClassId(classId: string) {
    try {
      let classStudent = await this._classStudentRepository
        .getOneDocument({
          class_id: classId,
        })
        .populate('students.user_id', 'avatar first_name last_name email');
      if (!classStudent) {
        throw new HttpException(
          'Not Found Class Student',
          HttpStatus.NOT_FOUND,
        );
      }
      return classStudent;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassStudentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getStudentByStudentId(classId: string, studentId: string) {
    try {
      let classStudent = await this._classStudentRepository.getOneDocument({
        class_id: classId,
        students: { $elemMatch: { student_id: studentId, status: 'SYNCED' } },
      });
      if (!classStudent) {
        throw new HttpException(
          'Not Found Student In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      return classStudent;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassStudentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async accountSync(classId: string, studentId: string, userId: string) {
    try {
      let classStudent = await this._classStudentRepository.getOneDocument({
        class_id: classId,
        students: { $elemMatch: { student_id: studentId } },
      });
      if (!classStudent) {
        throw new HttpException(
          'Not Found Student In Class',
          HttpStatus.NOT_FOUND,
        );
      }
      let index = classStudent.students.findIndex((e) => {
        return e.student_id == studentId;
      });
      if (classStudent.students[index].status == 'SYNCED') {
        throw new HttpException('Users Have Been Synced', HttpStatus.CONFLICT);
      }
      classStudent.students[index].status = 'SYNCED';
      classStudent.students[index].user_id = userId;
      let result = await this._classStudentRepository.updateDocument(
        { _id: classStudent._id },
        {
          students: classStudent.students,
        },
      );
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassStudentService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
