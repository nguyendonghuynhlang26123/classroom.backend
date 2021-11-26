import { ApiProperty } from '@nestjs/swagger';
import { IBase } from './base/base.interface';

export class AssignmentInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  grade_policy_id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  instructions: string;
  @ApiProperty()
  total_points: number;
  @ApiProperty()
  due_date: number;
}
