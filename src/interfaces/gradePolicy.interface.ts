import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IBase } from './base/base.interface';

export class GradePolicyInterface extends IBase {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  class_id: string;

  @ApiProperty({ type: Number })
  point: number;
}
