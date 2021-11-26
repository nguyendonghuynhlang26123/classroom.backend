import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GradePolicy } from '..';

@Injectable()
export class GradePolicyRepository extends Repository<GradePolicy> {
  @InjectModel('grade-policies') _model: Model<GradePolicy>;
}
