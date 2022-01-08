import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { NotificationInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Notification extends Document implements NotificationInterface {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
  })
  class_id: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }])
  for: string[];

  @Prop({ type: String, default: 'GRADE_REVIEW_UPDATE' })
  type: 'GRADE_REVIEW_UPDATE' | 'GRADE_FINALIZE';

  @Prop({ type: String, default: null })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  actor_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignments',
    default: null,
  })
  assignment: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'grading-assignments',
    default: null,
  })
  grading: string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
