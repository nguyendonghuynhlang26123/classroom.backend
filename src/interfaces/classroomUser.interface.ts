import { ApiProperty } from '@nestjs/swagger';
import { UserInterface } from './user.interface';
import { IBase } from './base/base.interface';

export class ClassroomUserInterface extends IBase {
  @ApiProperty()
  user_id: string | UserInterface;
  @ApiProperty()
  status: 'ACTIVATED' | 'INACTIVATED';
  @ApiProperty()
  role: 'TEACHER' | 'STUDENT';
  @ApiProperty()
  invite_code: string;
}
