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

  async getOneAdmin(email: string) {
    const admin = await this._adminRepository.getOneDocument({
      email: email,
    });
    return admin;
  }

  onCreate() {}
}
