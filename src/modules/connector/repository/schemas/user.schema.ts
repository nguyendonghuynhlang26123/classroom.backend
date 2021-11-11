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
  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;

  @Prop({ required: true, trim: true, unique: true})
  username: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({ default: null, text: true })
  first_name: string;

  @Prop({ default: null, text: true })
  last_name: string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ trim: true, default: null, unique: true })
  email: string;

  @Prop({ trim: true, default: null, unique: true, text: true })
  phone: string;

  @Prop({ type: String, default: 'user', enum: ['user', 'admin'] })
  user_type: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
