import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsString,
  Length,
  IsNotEmpty,
  Matches,
  IsEmail,
  IsMobilePhone,
  IsOptional,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String })
  @IsString()
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
}

export class RefreshTokenDto {
  @ApiProperty({ type: String })
  @IsString()
  refresh_token: string;
}

export class VerifyUser {
  @ApiProperty({ type: String })
  @IsString()
  otp: string;
}
