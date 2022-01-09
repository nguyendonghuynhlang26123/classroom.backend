import { ApiProperty } from '@nestjs/swagger';
import { AdminInterface, UserInterface } from '.';
import { IBase } from './base/base.interface';

export class BlackListInterface extends IBase {
  @ApiProperty()
  account: string | UserInterface;
  @ApiProperty()
  actor: string | AdminInterface;
  @ApiProperty()
  reason: string;
  @ApiProperty()
  restored: boolean;
}
