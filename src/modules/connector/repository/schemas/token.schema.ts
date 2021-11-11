import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IToken } from '../../../core/token/token.interface';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Token extends Document implements IToken {
  @Prop({ type: String })
  user_id: string;

  @Prop({ type: Boolean, default: false })
  is_revoked: boolean;

  @Prop({ type: Number, index: true })
  expires: number;

  @Prop({ type: Number, index: true })
  created_at: number;

  @Prop({ type: Number, index: true })
  updated_at: number;

  @Prop({ type: Number, index: true, default: null })
  deleted_at: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
