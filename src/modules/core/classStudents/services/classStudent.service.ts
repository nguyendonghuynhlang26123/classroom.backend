import {
  Injectable,
  HttpException,
  HttpStatus,
  StreamableFile,
} from '@nestjs/common';
import { ClassStudentInterface, StudentInterface } from 'src/interfaces';
import { Subscription } from 'rxjs';
import { ClassStudentRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { ImportCsvService } from 'src/modules/feature/importCsv/services/importCsv.service';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class ClassStudentService {
  subscription: Subscription = new Subscription();
  constructor(
    private _classStudentRepository: ClassStudentRepository,
    private _importCsvService: ImportCsvService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createClassStudent(file, classId: string) {
    try {
      let dataClassStudent: ClassStudentInterface = {
        class_id: classId,
        file_location: file != null ? file.filename : null,
        students: [],
      };
      if (file != null) {
        let listStudents = await this._importCsvService.importFile(file.path);
        for (let i = 0; i < listStudents.length; i++) {
          const e = listStudents[i];
          let student: StudentInterface = {
            student_id: e.student_id,
            student_name: e.name,
            status: 'NOT_SYNCED',
            user_id: null,
          };
          dataClassStudent.students.push(student);
        }
      }
      const createClassStudent = new this._classStudentRepository._model(
        dataClassStudent,
      );
      let classStudent = await this._classStudentRepository.create(
        createClassStudent,
      );
      return classStudent;
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassStudentService');
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

  async updateClassStudent(file, classId: string) {
    try {
      if (file == null) {
        throw new HttpException(
          'Csv File Cannot Empty',
          HttpStatus.BAD_REQUEST,
        );
      }
      let classStudent = await this._classStudentRepository.getOneDocument({
        class_id: classId,
      });
      classStudent.students = [];
      let listStudents = await this._importCsvService.importFile(file.path);
      for (let i = 0; i < listStudents.length; i++) {
        const e = listStudents[i];
        let student: StudentInterface = {
          student_id: e.student_id,
          student_name: e.name,
          status: 'NOT_SYNCED',
          user_id: null,
        };
        classStudent.students.push(student);
      }
      let result = await this._classStudentRepository.updateDocument(
        {
          _id: classStudent._id,
        },
        {
          file_location: file.filename,
          students: classStudent.students,
        },
      );
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassStudentService');
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

  async getStudentIdByUserId(classId: string, userId: string) {
    try {
      let classStudent = await this._classStudentRepository.getOneDocument({
        class_id: classId,
      });
      if (!classStudent) {
        throw new HttpException(
          'Not Found Class Student',
          HttpStatus.NOT_FOUND,
        );
      }
      let index = classStudent.students.findIndex((e) => {
        return e.user_id == userId;
      });
      if (index == -1) {
        throw new HttpException(
          'Not Found User Id In Class Student',
          HttpStatus.NOT_FOUND,
        );
      }
      return { student_id: classStudent.students[index].student_id };
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

  async getFile(fileName: string) {
    try {
      const file = readFileSync(
        join(process.cwd(), `/public/uploadCsv/${fileName}`),
      );
      return new StreamableFile(file);
    } catch (error) {
      this._logUtil.errorLogger(error, 'ClassStudentService');
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
