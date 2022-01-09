import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserActivationInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class UserActivation
  extends Document
  implements UserActivationInterface
{
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  user: string;

  @Prop({ type: String, required: true })
  activate_code: string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const UserActivationSchema =
  SchemaFactory.createForClass(UserActivation);
