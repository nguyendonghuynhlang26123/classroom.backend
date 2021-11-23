import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import {
  AssignmentInterface,
  ClassTopicInterface,
  GradeCriteria,
} from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Assignment extends Document implements AssignmentInterface {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
  })
  class_id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'class-topics',
    default: null,
  })
  topic: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  instructions: string;

  @Prop({ type: Number, default: 100 })
  total_points: number;

  @Prop({ type: Number, default: null })
  due_date: number;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        points: { type: Number, default: null },
      },
    ],
    default: [],
  })
  grade_criterias: GradeCriteria[];

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
