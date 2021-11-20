import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from '..';

@Injectable()
export class AssignmentRepository extends Repository<Assignment> {
  @InjectModel('assignments') _model: Model<Assignment>;
}
