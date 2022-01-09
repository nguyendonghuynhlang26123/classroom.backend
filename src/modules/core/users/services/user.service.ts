import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  UserInterface,
  GenericRes,
  GenericQuery,
  UpdateUserDTO,
  CreateUserDto,
  ChangePassDTO,
  GoogleCreateUserDto,
} from 'src/interfaces';
import { Subscription } from 'rxjs';
import { UserRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { MailService } from 'src/modules/feature/mail/mail.service';
import { UserActivationService } from '../../userActivations/services/userActivation.service';

@Injectable()
export class UserService {
  subscription: Subscription = new Subscription();
  constructor(
    private _userRepository: UserRepository,
    private _mailService: MailService,
    @Inject(forwardRef(() => UserActivationService))
    private _userActivationService: UserActivationService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createUser(data: CreateUserDto) {
    try {
      if (data.student_id) {
        let check = await this._userRepository.getOneDocument({
          student_id: data.student_id,
        });
        if (check) {
          throw new HttpException(
            'Student Id Already Exist',
            HttpStatus.CONFLICT,
          );
        }
      }
      let dataUser: UserInterface = {
        email: data.email,
        student_id: data.student_id || null,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar: null,
        google_id: null,
        is_activated: false,
        is_banned: false,
      };
      dataUser.password = await this.hashPassword(dataUser.password);
      const createUser = new this._userRepository._model(dataUser);
      let user = await this._userRepository.create(createUser);
      this._userActivationService.createUserActivation(user._id).then((e) => {
        this._mailService.sendActivationCode(
          user._id,
          user.email,
          user.first_name,
          e.activate_code,
        );
      });
      return user;
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
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

  async createGoogleUser(data: GoogleCreateUserDto) {
    try {
      let check = await this._userRepository.getOneDocument({
        email: data.email,
      });
      if (check) {
        if (check.google_id == null || check.google_id == data.google_id) {
          this.updateUser(check._id, check._id, data);
          check.google_id = data.google_id;
          check.first_name = data.first_name;
          check.last_name = data.last_name;
          check.avatar = data.avatar;
          delete check.password;
          return check;
        }
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
      let dataUser: UserInterface = {
        email: data.email,
        student_id: null,
        password: null,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar: data.avatar,
        google_id: data.google_id,
        is_activated: true,
        is_banned: false,
      };
      const createUser = new this._userRepository._model(dataUser);
      let user = await this._userRepository.create(createUser);
      return {
        _id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        google_id: user.google_id,
        is_activated: true,
        is_banned: false,
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
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

  async resetPassword(email: string) {
    try {
      let user = await this._userRepository.getOneDocument({
        email: email,
      });
      if (!user) {
        throw new HttpException(
          `Not Found User with email: '${email}'`,
          HttpStatus.NOT_FOUND,
        );
      }
      let newPassword = '@M0orssalc' + Math.random().toString(36).substr(2, 6);
      user.password = await this.hashPassword(newPassword);
      let result = await this._userRepository.updateDocument(
        { _id: user._id },
        { password: user.password },
      );
      this._mailService.sendResetPassMail(user.email, newPassword);
      return { status: 200 };
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
      if (dataUpdate.student_id) {
        let check = await this._userRepository.getOneDocument({
          student_id: dataUpdate.student_id,
        });
        if (check && check._id != user._id) {
          throw new HttpException(
            'Student Id Already Exist',
            HttpStatus.CONFLICT,
          );
        }
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

  async activateUser(userId: string) {
    try {
      let user = await this._userRepository.getOneDocument({
        _id: userId,
      });
      if (!user) {
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      }
      let result = await this._userRepository.updateDocument(
        { _id: user._id },
        { is_activated: true },
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
            password: 0,
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
      if (!user) {
        throw new HttpException('Not Found User', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findUserByEmail(email: string) {
    try {
      let user = await this._userRepository
        .getOneDocument({
          email: email,
        })
        .select({ password: 0 });
      if (!user) {
        throw new HttpException('Not Found User', HttpStatus.NOT_FOUND);
      }
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
