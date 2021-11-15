import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  room: string;
}
