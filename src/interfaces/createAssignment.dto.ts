import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({ type: Number })
  @IsString()
  @IsNotEmpty()
  ui_index?: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({ type: Number, default: 100 })
  @IsNumber()
  @IsOptional()
  total_points?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  due_date?: number;
}

export class QueryAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  assignment_id: string;
}