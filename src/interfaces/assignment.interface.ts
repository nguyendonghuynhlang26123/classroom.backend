import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IBase } from './base/base.interface';
import { ClassTopicInterface } from './classTopic.interface';

export class GradeCriteria {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  points: string;
}

export class AssignmentInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  topic: ClassTopicInterface;
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
