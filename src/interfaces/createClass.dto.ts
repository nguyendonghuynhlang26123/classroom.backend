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
  class_id: string;
}
