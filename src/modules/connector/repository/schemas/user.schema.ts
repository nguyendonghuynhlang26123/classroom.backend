import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class User extends Document implements UserInterface {
  @Prop({ type: String, trim: true, required: true, unique: true })
  email: string;

  @Prop({ type: String, default: null })
  student_id: string;

  @Prop({ type: String, default: null, trim: true })
  password: string;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({ default: null })
  first_name: string;

  @Prop({ default: null })
  last_name: string;

  @Prop({ type: String, default: null })
  google_id: string;

  @Prop({ type: Boolean, default: false })
  is_activated: boolean;

  @Prop({ type: Boolean, default: false })
  is_banned: boolean;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ first_name: 'text', last_name: 'text' });
