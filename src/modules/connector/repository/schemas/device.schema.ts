import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { DeviceInterface } from 'src/interfaces';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Device extends Document implements DeviceInterface {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  })
  user_id: string;

  @Prop({ type: String, required: true })
  socket_id: string;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: Number })
  updated_at: number;

  @Prop({ type: Number, default: null, index: true })
  deleted_at: number;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
