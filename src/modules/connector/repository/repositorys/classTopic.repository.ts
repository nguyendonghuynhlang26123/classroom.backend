import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassTopic } from '..';

@Injectable()
export class ClassTopicRepository extends Repository<ClassTopic> {
  @InjectModel('class-topics') _model: Model<ClassTopic>;
}
