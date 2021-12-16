import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBooleanString,
  IsNumberString,
  IsMongoId,
  IsString,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class GenericQuery {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  per_page: number;

  @ApiPropertyOptional()
  sort_by: string;

  @ApiPropertyOptional()
  sort_type: string;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  is_deleted?: string;
}

export class DownloadQueryDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  file_name: string;
}