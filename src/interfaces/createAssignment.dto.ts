import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  grade_policy_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  total_points: number;

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

export class UpdateAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  grade_policy_id?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  total_points?: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  due_date?: number;
}