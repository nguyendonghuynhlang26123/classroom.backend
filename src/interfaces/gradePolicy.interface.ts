import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IBase } from './base/base.interface';

export class GradePolicyInterface extends IBase {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  points?: number;
}
