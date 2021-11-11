import { Injectable } from '@nestjs/common';
import { Repository } from './base/repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '..';

@Injectable()
export class TokenRepository extends Repository<Token> {
  @InjectModel('refresh_tokens') _model: Model<Token>;
}
