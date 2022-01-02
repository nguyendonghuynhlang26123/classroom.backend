import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityStream } from '..';

@Injectable()
export class ActivityStreamRepository extends Repository<ActivityStream> {
  @InjectModel('activity-streams') _model: Model<ActivityStream>;
}
