import { ApiProperty } from '@nestjs/swagger';
import { AssignmentInterface, UserInterface } from '.';
import { IBase } from './base/base.interface';

export class ActivityStreamInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  type: 'ASSIGNMENT_ADD' | 'CLASSROOM_INFO_UPDATE' | 'TEACHER_JOIN' | 'GRADING_FINALIZED' | 'OTHER';
  @ApiProperty()
  description: string;
  @ApiProperty()
  actor: string | UserInterface;
  @ApiProperty()
  assignment_id: string | AssignmentInterface;
}