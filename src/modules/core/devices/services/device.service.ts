import {
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeviceInterface, GenericRes, GenericQuery } from 'src/interfaces';
import { DeviceRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class DeviceService {
  constructor(
    private _deviceRepository: DeviceRepository,
    private _logUtil: LoggerUtilService,
  ) {
    this.onCreate();
  }
  @WebSocketServer()
  server: Server;

  async createDevice(data: DeviceInterface) {
    try {
      const createDevice = new this._deviceRepository._model(data);
      let device = await this._deviceRepository.create(createDevice);
      return device;
    } catch (error) {
      this._logUtil.errorLogger(error, 'DeviceService');
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

  async removeDevice(data: DeviceInterface) {
    try {
      const device = await this._deviceRepository.getOneDocument({
        user_id: data.user_id,
        socket_id: data.socket_id,
      });
      if (!device) {
        throw new HttpException('Not Found Device', HttpStatus.NOT_FOUND);
      }
      let result = await this._deviceRepository.removeDocument({
        _id: device._id,
      });
      return result;
    } catch (error) {
      this._logUtil.errorLogger(error, 'DeviceService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async pushNoti(listUser: string[], notification) {
    try {
      const devices = await this._deviceRepository.getAllDocument(
        {
          user_id: listUser,
        },
        { _id: 1, socket_id: 1 },
      );
      for (let i = 0; i < devices.length; i++) {
        const e = devices[i];
        this.server.to(e.socket_id).emit('notification', notification);
      }
      return;
    } catch (error) {
      this._logUtil.errorLogger(error, 'DeviceService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllSocketIds(listUsers: string[]) {
    try {
      const devices = await this._deviceRepository.getAllDocument(
        {
          user_id: listUsers,
        },
        { _id: 1, socket_id: 1 },
      );
      return devices.map((d) => d.socket_id);
    } catch (error) {
      this._logUtil.errorLogger(error, 'DeviceService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
