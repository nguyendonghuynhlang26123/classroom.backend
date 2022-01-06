import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminInterface, GenericRes, GenericQuery } from 'src/interfaces';
import { Subscription } from 'rxjs';
import { AdminRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class AdminService {
  subscription: Subscription = new Subscription();
  constructor(
    private _adminRepository: AdminRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  async uploadAvatar(adminId: string, url: string) {
    try {
      const admin = await this._adminRepository
        .getOneDocument({
          _id: adminId,
        })
        .select({ password: 0 });
      if (!admin) {
        throw new HttpException('Not Found Admin', HttpStatus.NOT_FOUND);
      }
      let result = await this._adminRepository.updateDocument(
        { _id: admin._id },
        { avatar: url },
      );
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AdminService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getOneAdmin(email: string) {
    const admin = await this._adminRepository.getOneDocument({
      email: email,
    });
    return admin;
  }

  onCreate() {}
}
