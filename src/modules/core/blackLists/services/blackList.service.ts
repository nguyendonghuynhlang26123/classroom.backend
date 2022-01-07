import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  BlackListInterface,
  GenericRes,
  GenericQuery,
  CreateBlackListDto,
} from 'src/interfaces';
import { Subscription } from 'rxjs';
import { BlackListRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';

@Injectable()
export class BlackListService {
  subscription: Subscription = new Subscription();
  constructor(
    private _blackListRepository: BlackListRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }

  async createBlackList(data: CreateBlackListDto, adminId: string) {
    try {
      const check = await this._blackListRepository.getOneDocument({
        account: data.user_id,
        restored: false,
      });
      if (check) {
        throw new HttpException(
          'This account has already been banned.',
          HttpStatus.CONFLICT,
        );
      }
      let dataBlackList: BlackListInterface = {
        account: data.user_id,
        actor: adminId,
        reason: data.reason,
        restored: false,
      };
      const createBlackList = new this._blackListRepository._model(
        dataBlackList,
      );
      let blackList = await this._blackListRepository.create(createBlackList);
      return blackList;
    } catch (error) {
      this._logUtil.errorLogger(error, 'BlackListService');
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

  async getAllBlackList(query: GenericQuery) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._blackListRepository.getAllDocument(
          {},
          {
            password: 0,
          },
          builder,
          Number(query.per_page),
          Number(query.page),
        ),
        this._blackListRepository.getCountPage({}, Number(query.per_page)),
      ]);
      return <GenericRes<BlackListInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'BlackListService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAccountInBlackList(userId: string) {
    try {
      const blackList = await this._blackListRepository.getOneDocument({
        account: userId,
        restored: false,
      });
      if (blackList) {
        throw new HttpException(blackList.reason, HttpStatus.FORBIDDEN);
      }
      return blackList;
    } catch (error) {
      this._logUtil.errorLogger(error, 'BlackListService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async updateBlackListRestore(blackListId: string) {
    try {
      const blackList = await this._blackListRepository.getOneDocument({
        _id: blackListId,
      });
      if (!blackList) {
        throw new HttpException('Not Found BlackList', HttpStatus.NOT_FOUND);
      }
      let result = await this._blackListRepository.updateDocument(
        { _id: blackList._id },
        { restored: true },
      );
      return { status: 200 };
    } catch (error) {
      this._logUtil.errorLogger(error, 'BlackListService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
