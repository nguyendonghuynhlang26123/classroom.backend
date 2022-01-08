import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '..';

@Injectable()
export class NotificationRepository extends Repository<Notification> {
  @InjectModel('notifications') _model: Model<Notification>;
}
