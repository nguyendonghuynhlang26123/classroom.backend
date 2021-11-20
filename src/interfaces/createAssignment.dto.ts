import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ClassTopicInterface, GradeCriteria } from '.';

export class CreateAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: ClassTopicInterface })
  @ValidateNested()
  @Type(() => ClassTopicInterface)
  @IsOptional()
  topic?: ClassTopicInterface;

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
  @IsNotEmpty()
  total_points: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  due_date?: number;

  @ApiProperty({ type: () => [GradeCriteria] })
  @ValidateNested()
  @Type(() => GradeCriteria)
  @IsOptional()
  grade_criterias?: GradeCriteria[];
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
