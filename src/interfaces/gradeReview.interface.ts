import { ApiProperty } from '@nestjs/swagger';
import {
  AssignmentInterface,
  GradingAssignmentInterface,
  UserInterface,
} from '.';
import { IBase } from './base/base.interface';

export class CommentInterface {
  author: string | UserInterface;
  message: string;
  created_at: number;
}

export class GradeReviewInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  student_account: string | UserInterface;
  @ApiProperty()
  assignment_id: string | AssignmentInterface;
  @ApiProperty()
  grading_id: string | GradingAssignmentInterface;
  @ApiProperty()
  expect_mark: number;
  @ApiProperty()
  status: 'OPEN' | 'REJECTED' | 'APPROVED';
  @ApiProperty()
  comments: CommentInterface[];
}
