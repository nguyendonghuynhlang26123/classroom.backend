import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IBase } from './base/base.interface';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsVNName } from './base/validVNName';

export class UserInterface extends IBase {
  @ApiProperty()
  student_id: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  google_id: string;
  // @ApiProperty()
  // user_type: 'user' | 'admin';
}

// export class UpdateUserTypeDTO {
//   @ApiProperty({ type: String })
//   @IsString()
//   @IsIn(['admin', 'user'])
//   user_type: 'admin' | 'user';
// }

export class UpdateUserDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  student_id: string;

  @ApiProperty()
  @IsString()
  @IsVNName()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsVNName()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  avatar?: string;
}
