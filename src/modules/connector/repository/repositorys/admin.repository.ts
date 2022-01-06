import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '..';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  @InjectModel('admins') _model: Model<Admin>;
}
