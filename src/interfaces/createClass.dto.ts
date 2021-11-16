import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
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
  @IsOptional()
  subject?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  room?: string;
}

export class QueryClassDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;
}

export class InviteUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: 'STUDENT' })
  @IsString()
  @IsIn(['ADMIN', 'TEACHER', 'STUDENT'])
  @IsNotEmpty()
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export class AcceptInviteUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ default: 'STUDENT' })
  @IsString()
  @IsIn(['ADMIN', 'TEACHER', 'STUDENT'])
  @IsNotEmpty()
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;
}
