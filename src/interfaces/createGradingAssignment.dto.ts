import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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

export class UpdateGradingAssignmentDto {
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
  @IsNotEmpty()
  mark: number;
}

export class CreateArrayGradingDto {
  @ApiProperty({ type: () => [CreateGradingAssignmentDto] })
  @ValidateNested()
  @Type(() => CreateGradingAssignmentDto)
  @IsNotEmpty()
  data: CreateGradingAssignmentDto[];
}

export class UpdateArrayGradingDto {
  @ApiProperty({ type: () => [UpdateGradingAssignmentDto] })
  @ValidateNested()
  @Type(() => UpdateGradingAssignmentDto)
  @IsNotEmpty()
  data: UpdateGradingAssignmentDto[];
}

export class QueryGradingStudentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  student_id: string;
}

export class QueryGradingAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  assignment_id: string;
}
