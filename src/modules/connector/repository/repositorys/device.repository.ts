import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from '..';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  @InjectModel('devices') _model: Model<Device>;
}
