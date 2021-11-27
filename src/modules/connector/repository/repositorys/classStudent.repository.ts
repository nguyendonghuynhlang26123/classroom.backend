import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassStudent } from '..';

@Injectable()
export class ClassStudentRepository extends Repository<ClassStudent> {
  @InjectModel('class-students') _model: Model<ClassStudent>;
}
