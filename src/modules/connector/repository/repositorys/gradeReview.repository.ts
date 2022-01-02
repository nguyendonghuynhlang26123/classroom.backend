import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GradeReview } from '..';

@Injectable()
export class GradeReviewRepository extends Repository<GradeReview> {
  @InjectModel('grade-reviews') _model: Model<GradeReview>;
}
