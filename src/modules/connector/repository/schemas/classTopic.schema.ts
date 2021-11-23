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
export class ClassTopic extends Document implements ClassTopicInterface {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
  })
  class_id: string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const ClassTopicSchema = SchemaFactory.createForClass(ClassTopic);
ClassTopicSchema.index(
  { title: 1, class_id: 1, deleted_at: 1 },
  { unique: true },
);
