import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  UserActivationInterface,
  GenericRes,
  GenericQuery,
} from 'src/interfaces';
import { UserActivationRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class UserActivationService {
  constructor(
    private _userActivationRepository: UserActivationRepository,
    @Inject(forwardRef(() => UserService))
    private _userService: UserService,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createUserActivation(userId: string) {
    try {
      const user = await this._userService.findUserById(userId);
      if (user.is_activated) {
        throw new HttpException(
          'This email is already activated.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const check = await this._userActivationRepository.getOneDocument({
        _id: userId,
      });
      if (check) {
        throw new HttpException(
          'Activation code was spent and still available.',
          HttpStatus.CONFLICT,
        );
      }
      let data: UserActivationInterface = {
        user: userId,
        activate_code: Math.random().toString(36).substr(2, 6),
      };
      const createUserActivation = new this._userActivationRepository._model(
        data,
      );
      let userActivation = await this._userActivationRepository.create(
        createUserActivation,
      );
      return userActivation;
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserActivationService');
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

  async activateUser(userId: string, activationCode: string) {
    try {
      const user = await this._userService.findUserById(userId);
      if (user.is_activated) {
        throw new HttpException(
          'This email is already activated.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const check = await this._userActivationRepository.getOneDocument({
        user: user._id,
      });
      if (!check) {
        throw new HttpException(
          'Not Found User Activation',
          HttpStatus.NOT_FOUND,
        );
      }
      if (check.activate_code == activationCode) {
        this._userService.activateUser(userId);
        return { status: 200 };
      }
      throw new HttpException('Invalid Code', HttpStatus.BAD_REQUEST);
    } catch (error) {
      this._logUtil.errorLogger(error, 'UserActivationService');
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

  onCreate() {}
}
