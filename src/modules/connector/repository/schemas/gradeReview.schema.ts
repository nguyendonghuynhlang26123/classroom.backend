import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CommentInterface, GradeReviewInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class GradeReview extends Document implements GradeReviewInterface {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
  })
  class_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true })
  student_account: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'assignments',
    required: true,
  })
  assignment_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'grading-assignments',
    required: true,
  })
  grading_id: string;

  @Prop({ type: Number, required: true })
  expect_mark: number;

  @Prop({ type: String, default: 'OPEN' })
  status: 'OPEN' | 'REJECTED' | 'APPROVED';

  @Prop({
    type: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
        },
        message: { type: String, required: true },
        created_at: { type: Number },
      },
    ],
    default: [],
  })
  comments: CommentInterface[];

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const GradeReviewSchema = SchemaFactory.createForClass(GradeReview);
