import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlackList } from '..';

@Injectable()
export class BlackListRepository extends Repository<BlackList> {
  @InjectModel('black-lists') _model: Model<BlackList>;
}
