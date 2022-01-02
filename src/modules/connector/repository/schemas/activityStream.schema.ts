import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ActivityStreamInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class ActivityStream
  extends Document
  implements ActivityStreamInterface
{
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
  })
  class_id: string;

  @Prop({ type: String, default: 'OTHER' })
  type:
    | 'ASSIGNMENT_ADD'
    | 'CLASSROOM_INFO_UPDATE'
    | 'TEACHER_JOIN'
    | 'GRADING_FINALIZED'
    | 'OTHER';

  @Prop({ type: String, default: null })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  actor: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignment',
    default: null,
  })
  assignment_id: string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const ActivityStreamSchema =
  SchemaFactory.createForClass(ActivityStream);
