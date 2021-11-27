import { ApiProperty } from '@nestjs/swagger';
import { UserInterface } from '.';
import { IBase } from './base/base.interface';

export class StudentInterface {
  @ApiProperty()
  student_id: string;
  @ApiProperty()
  student_name: string;
  @ApiProperty()
  status: 'SYNCED' | 'NOT_SYNCED';
  @ApiProperty()
  user_id: string | UserInterface;
}

export class ClassStudentInterface extends IBase {
  @ApiProperty()
  class_id: string;
  @ApiProperty()
  file_location: string;
  @ApiProperty()
  students: StudentInterface[];
}
