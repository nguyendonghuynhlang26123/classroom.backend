import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  UserInterface,
  GenericRes,
  GenericQuery,
  UpdateUserDTO,
  CreateUserDto,
  ChangePassDTO,
} from 'src/interfaces';
import { Subscription } from 'rxjs';
import { UserRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class UserService {
  subscription: Subscription = new Subscription();
  constructor(
    private _userRepository: UserRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createUser(data: CreateUserDto) {
    try {
      let dataUser: UserInterface = {
        email: data.email,
        password: data.password,
        student_id: null,
        first_name: null,
        last_name: null,
        avatar: null,
        google_id: null,
      };
      dataUser.password = await this.hashPassword(dataUser.password);
      const createUser = new this._userRepository._model(dataUser);
      let user = await this._userRepository.create(createUser);
      return user;
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code == 11000 || error.code == 11001) {
        throw new HttpException(
          `Duplicate key error collection: ${Object.keys(error.keyValue)}`,
          HttpStatus.BAD_REQUEST,
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

  async changePass(userID: string, paramId: string, data: ChangePassDTO) {
    try {
      if (userID != paramId) {
        throw new HttpException('Not Expired', HttpStatus.CONFLICT);
      }
      if (data.new_password != data.confirm_password) {
        throw new HttpException('Not Expired', HttpStatus.CONFLICT);
      }
      let user = await this._userRepository.getOneDocument({
        _id: paramId,
      });
      if (!user) {
        throw new HttpException('Not Expired', HttpStatus.CONFLICT);
      }

      const match = await bcrypt.compare(data.old_password, user.password);
      if (!match) {
        throw new HttpException('Not Expired', HttpStatus.CONFLICT);
      }
      user.password = await this.hashPassword(data.new_password);
      return await this._userRepository.updateDocument(
        { _id: user._id },
        { password: user.password },
      );
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(userID: string, paramId: string, dataUpdate: UpdateUserDTO) {
    try {
      let user = await this._userRepository.getOneDocument({
        _id: paramId,
      });
      if (!user) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      if (userID != paramId) {
        throw new HttpException('Not Expired', HttpStatus.CONFLICT);
      }
      let result = await this._userRepository.updateDocument(
        { _id: user._id },
        { ...dataUpdate },
      );
      return result;
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(userAction, paramId: string) {
    try {
      let user = await this._userRepository.getOneDocument({
        _id: paramId,
      });
      if (userAction._id != paramId) {
        throw new HttpException('Not Expired', HttpStatus.CONFLICT);
      }
      return await this._deleteUser(user._id);
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async _deleteUser(paramId) {
    this._userRepository.getOneDocument({
      _id: paramId,
    });
    let result = await this._userRepository.removeDocument({
      _id: paramId,
    });
    return result;
  }

  async getAllUser(query: GenericQuery) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._userRepository.getAllDocument(
          {},
          {
            username: 1,
            _id: 1,
            first_name: 1,
            last_name: 1,
            created_at: 1,
            updated_at: 1,
            email: 1,
            phone: 1,
            user_type: 1,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._userRepository.getCountPage({}, Number(query.per_page)),
      ]);
      return <GenericRes<UserInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(userId: string) {
    try {
      let user = await this._userRepository
        .getOneDocument({
          _id: userId,
        })
        .select({ password: 0 });
      return user;
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getOneUser(email: string) {
    const user = await this._userRepository.getOneDocument({
      email: email,
    });
    return user;
  }

  onCreate() {}
}
