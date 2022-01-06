import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { AdminInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Admin extends Document implements AdminInterface {
  @Prop({ type: String, trim: true, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop({ type: Boolean, default: false })
  is_root: boolean;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
