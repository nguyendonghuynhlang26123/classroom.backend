import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsAscii,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
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
}

export class GoogleCreateUserDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  google_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  token_id: string;
}
