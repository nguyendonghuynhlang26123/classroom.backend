import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  NotificationInterface,
  GenericRes,
  GenericQuery,
} from 'src/interfaces';
import { NotificationRepository } from '../../../connector/repository';
import { LoggerUtilService } from '../../../shared/loggerUtil';
import { DeviceService } from '../../devices/services/device.service';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private _notificationRepository: NotificationRepository,
    private _deviceService: DeviceService,
    private _logUtil: LoggerUtilService,
    private _gateway: NotificationGateway,
  ) {
    this.onCreate();
  }

  async createNotification(data: NotificationInterface) {
    try {
      const createNotification = new this._notificationRepository._model(data);
      let notification = await this._notificationRepository.create(
        createNotification,
      );
      const socketIds = await this._deviceService.getAllSocketIds(
        notification.for.filter((uid) => uid !== notification.actor_id),
      );
      for (let i = 0; i < socketIds.length; i++) {
        const socketId = socketIds[i];
        this._gateway.server.to(socketId).emit('notification', notification);
      }
      return notification;
    } catch (error) {
      this._logUtil.errorLogger(error, 'NotificationService');
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

  async getAllNotification(query: GenericQuery, userId: string) {
    try {
      let builder = {};
      if (query.sort_by && query.sort_type) {
        builder[query.sort_by] = query.sort_type;
      }
      const data = await Promise.all([
        this._notificationRepository
          .getAllDocument(
            { for: userId, actor_id: { $ne: userId } },
            {
              __v: 0,
            },
            builder,
            Number(query.per_page),
            Number(query.page),
          )
          .populate('actor_id assignment'),
        this._notificationRepository.getCountPage(
          { for: userId, actor_id: { $ne: userId } },
          Number(query.per_page),
        ),
      ]);
      return <GenericRes<NotificationInterface>>{
        data: data[0],
        total_page: data[1],
      };
    } catch (error) {
      this._logUtil.errorLogger(error, 'NotificationService');
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  onCreate() {}
}
