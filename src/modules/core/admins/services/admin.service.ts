import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  AdminInterface,
  GenericRes,
  GenericQuery,
  AdminQuery,
  CreateAdminDto,
  UpdateAdminDto,
  UserInterface,
  UpdateUserDTO,
} from 'src/interfaces';
import { Subscription } from 'rxjs';
import { AdminRepository, UserRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class AdminService {
  subscription: Subscription = new Subscription();
  constructor(
    private _adminRepository: AdminRepository,
    private _userRepository: UserRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createAdmin(data: CreateAdminDto) {
    try {
      let dataAdmin: AdminInterface = {
        email: data.email,
        password: data.password,
        name: data.name,
        avatar: null,
        is_root: false,
      };
      dataAdmin.password = await this.hashPassword(dataAdmin.password);
      const createAdmin = new this._adminRepository._model(dataAdmin);
      let admin = await this._adminRepository.create(createAdmin);
      return admin;
    } catch (error) {
      this._logUtil.errorLogger(error, 'AdminService');
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

  async hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  async getAllAdmin(query: AdminQuery) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        let sortBy = query.sort_by.split(',');
        for (let i = 0; i < sortBy.length; i++) {
          const e = sortBy[i];
          builder[e] = query.sort_type;
        }
      }
      let filter = {};
      if (query.query) {
        filter = { $text: { $search: query.query } };
      }
      const data = await Promise.all([
        this._adminRepository.getAllDocument(
          filter,
          {
            password: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._adminRepository.getCountPage(filter, Number(query.per_page)),
      ]);
      return <GenericRes<AdminInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AdminService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllUserAccount(query: AdminQuery, email: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        let sortBy = query.sort_by.split(',');
        for (let i = 0; i < sortBy.length; i++) {
          const e = sortBy[i];
          builder[e] = query.sort_type;
        }
      }
      let filter = {};
      if (query.query) {
        filter = { $text: { $search: query.query } };
      }
      const data = await Promise.all([
        this._userRepository.getAllDocument(
          { email: email, ...filter },
          {
            password: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._userRepository.getCountPage(
          { email: email, ...filter },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<UserInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'AdminService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAdminById(adminId: string) {
    try {
      const admin = await this._adminRepository.getOneDocument({
        _id: adminId,
      });
      if (!admin) {
        throw new HttpException('Not Found Admin', HttpStatus.NOT_FOUND);
      }
      return admin;
    } catch (error) {
      this._logUtil.errorLogger(error, 'AdminService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(email: string, userId: string) {
    try {
      const user = await this._userRepository.getOneDocument({
        _id: userId,
        email: email,
      });
      if (!user) {
        throw new HttpException('Not Found User Account', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      this._logUtil.errorLogger(error, 'AdminService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async updateAdmin(adminId: string, dataUpdate: UpdateAdminDto) {
    try {
      const admin = await this._adminRepository.getOneDocument({
        _id: adminId,
      });
      if (!admin) {
        throw new HttpException('Not Found Admin', HttpStatus.NOT_FOUND);
      }
      let result = await this._adminRepository.updateDocument(
        { _id: admin._id },
        dataUpdate,
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

  async updateUserAccount(
    email: string,
    userId: string,
    dataUpdate: UpdateUserDTO,
  ) {
    try {
      const user = await this._userRepository.getOneDocument({
        _id: userId,
        email: email,
      });
      if (!user) {
        throw new HttpException('Not Found User Account', HttpStatus.NOT_FOUND);
      }
      let result = await this._userRepository.updateDocument(
        { _id: user._id },
        dataUpdate,
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

  async deleteAdmin(adminId: string) {
    try {
      const admin = await this._adminRepository.getOneDocument({
        _id: adminId,
      });
      if (!admin) {
        throw new HttpException('Not Found Admin', HttpStatus.NOT_FOUND);
      }
      const result = this._adminRepository.deleteDocument({
        _id: adminId,
      });
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
