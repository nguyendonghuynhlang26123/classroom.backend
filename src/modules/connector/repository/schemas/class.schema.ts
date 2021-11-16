import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ClassInterface, ClassroomUserInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Class extends Document implements ClassInterface {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  section: string;

  @Prop({ type: String, default: null })
  subject: string;

  @Prop({ type: String, default: null })
  room: string;

  @Prop({
    type: String,
    default: 'https://gstatic.com/classroom/themes/img_backtoschool.jpg',
  })
  image: 'https://gstatic.com/classroom/themes/img_backtoschool.jpg';

  @Prop({ type: String, default: Math.random().toString(36).substr(2, 6) })
  code: string;

  @Prop({
    type: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
        status: { type: String, enum: ['ACTIVATED', 'INACTIVATED'] },
        role: { type: String, enum: ['ADMIN', 'TEACHER', 'STUDENT'] },
        invite_code: {
          type: String,
          default: null,
        },
      },
    ],
    default: [],
  })
  users: ClassroomUserInterface[];

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
