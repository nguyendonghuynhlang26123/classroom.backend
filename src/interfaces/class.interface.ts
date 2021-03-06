import { ApiProperty } from '@nestjs/swagger';
import { ClassroomUserInterface } from './classroomUser.interface';
import { IBase } from './base/base.interface';

export class ClassInterface extends IBase {
  @ApiProperty()
  title: string;
  @ApiProperty()
  section: string;
  @ApiProperty()
  subject: string;
  @ApiProperty()
  room: string;
  @ApiProperty()
  image: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  users: ClassroomUserInterface[];
}
