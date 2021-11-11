import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '..';

@Injectable()
export class UserRepository extends Repository<User> {
  @InjectModel('users') _model: Model<User>;
}
