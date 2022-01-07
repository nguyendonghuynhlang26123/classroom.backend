import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { BlackListInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class BlackList extends Document implements BlackListInterface {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  account: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admins',
    required: true,
  })
  actor: string;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: Boolean, default: false })
  restored: boolean;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const BlackListSchema = SchemaFactory.createForClass(BlackList);
