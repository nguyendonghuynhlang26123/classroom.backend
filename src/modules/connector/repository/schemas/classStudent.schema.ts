import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClassStudentInterface, StudentInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class ClassStudent extends Document implements ClassStudentInterface {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classes',
    required: true,
    unique: true,
  })
  class_id: string;

  @Prop({ type: String, default: null })
  file_location: string;

  @Prop({
    type: [
      {
        student_id: { type: String, required: true },
        student_name: { type: String, required: true },
        status: { type: String, enum: ['SYNCED', 'NOT_SYNCED'] },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      },
    ],
    default: [],
  })
  students: StudentInterface[];

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const ClassStudentSchema = SchemaFactory.createForClass(ClassStudent);
