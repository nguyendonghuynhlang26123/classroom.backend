import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsAscii()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  )
  @IsNotEmpty()
  @Length(6, 24)
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(2)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UpdateAdminDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(2)
  @IsOptional()
  name?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class ParamAdminDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  admin_id: string;
}

export class ParamUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class ParamBlacklistDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  blacklist_id: string;
}
