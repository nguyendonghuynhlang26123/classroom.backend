import { ApiProperty } from '@nestjs/swagger';
import { IBase } from './base/base.interface';

export class AdminInterface extends IBase {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  is_root: boolean;
}
