import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from '..';

@Injectable()
export class ClassRepository extends Repository<Class> {
  @InjectModel('classes') _model: Model<Class>;
}
