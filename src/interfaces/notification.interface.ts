import { ApiProperty } from '@nestjs/swagger';
import {
  AssignmentInterface,
  GradingAssignmentInterface,
  UserInterface,
} from '.';
import { IBase } from './base/base.interface';

export class NotificationInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  for: string[];
  @ApiProperty()
  type: 'GRADE_REVIEW_UPDATE' | 'GRADE_FINALIZE';
  @ApiProperty()
  description: string;
  @ApiProperty()
  actor_id: string | UserInterface;
  @ApiProperty()
  assignment: string | AssignmentInterface;
  @ApiProperty()
  grading: string | GradingAssignmentInterface;
}
