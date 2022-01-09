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
  @IsIn(['TEACHER', 'STUDENT'])
  @IsNotEmpty()
  role: 'TEACHER' | 'STUDENT';
}

export class AcceptInviteUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ default: 'STUDENT' })
  @IsString()
  @IsIn(['TEACHER', 'STUDENT'])
  @IsNotEmpty()
  role: 'TEACHER' | 'STUDENT';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UserJoinClassDto {
  @ApiProperty({ default: 'STUDENT' })
  @IsString()
  @IsIn(['TEACHER', 'STUDENT'])
  @IsNotEmpty()
  role: 'TEACHER' | 'STUDENT';

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateClassDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  section?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  room?: string;
}
