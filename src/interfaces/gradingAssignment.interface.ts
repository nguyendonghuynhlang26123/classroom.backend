import { ApiProperty } from '@nestjs/swagger';
import { IBase } from './base/base.interface';

export class GradingAssignmentInterface extends IBase {
  @ApiProperty()
  assignment_id: string;
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  student_id: string;
  @ApiProperty()
  mark: number;
  @ApiProperty()
  status: "FINAL" | "DRAFT";
}
