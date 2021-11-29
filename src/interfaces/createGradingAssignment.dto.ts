import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGradingAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  assignment_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  mark?: number;
}

export class QueryGradingAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  grading_assignment_id: string;
}
