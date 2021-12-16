import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GradingAssignment } from '..';

@Injectable()
export class GradingAssignmentRepository extends Repository<GradingAssignment> {
  @InjectModel('grading-assignments') _model: Model<GradingAssignment>;
}
