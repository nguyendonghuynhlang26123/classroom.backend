import { ApiProperty } from '@nestjs/swagger';
import { UserInterface } from './user.interface';
import { IBase } from './base/base.interface';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UserActivationInterface extends IBase {
  @ApiProperty()
  user: string | UserInterface;
  @ApiProperty()
  activate_code: string;
}

export class ActivateDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  activate_code: string;
}
