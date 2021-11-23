import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IBase } from './base/base.interface';
import { ClassTopicInterface } from './classTopic.interface';

export class GradeCriteria {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  points?: number;
}

export class AssignmentInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  topic: string | ClassTopicInterface;
  @ApiProperty()
  title: string;
  @ApiProperty()
  instructions: string;
  @ApiProperty()
  total_points: number;
  @ApiProperty()
  due_date: number;
  @ApiProperty()
  grade_criterias: GradeCriteria[];
}
