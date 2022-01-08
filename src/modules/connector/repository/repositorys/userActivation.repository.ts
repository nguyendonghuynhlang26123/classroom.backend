import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserActivation } from '..';

@Injectable()
export class UserActivationRepository extends Repository<UserActivation> {
  @InjectModel('user-activations') _model: Model<UserActivation>;
}
