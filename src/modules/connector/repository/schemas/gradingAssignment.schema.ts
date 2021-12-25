import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { GradingAssignmentInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class GradingAssignment
  extends Document
  implements GradingAssignmentInterface
{
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignments',
    required: true,
  })
  assignment_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
  })
  class_id: string;

  @Prop({ type: String, required: true })
  student_id: string;

  @Prop({ type: Number, default: null })
  mark: number;

  @Prop({ type: String, default: 'DRAFT' })
  status: 'FINAL' | 'DRAFT';

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const GradingAssignmentSchema =
  SchemaFactory.createForClass(GradingAssignment);
GradingAssignmentSchema.index(
  { assignment_id: 1, class_id: 1, student_id: 1, deleted_at: 1 },
  { unique: true },
);
