import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBooleanString,
  IsNumberString,
  IsMongoId,
  IsString,
  IsBoolean,
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