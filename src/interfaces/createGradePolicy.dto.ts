import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateGradePolicyDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  point: number;
}

export class CreateArrayGradePolicyDto {
  @ApiProperty({ type: () => [CreateGradePolicyDto] })
  @ValidateNested()
  @Type(() => CreateGradePolicyDto)
  @IsNotEmpty()
  data: CreateGradePolicyDto[];
}

export class UpdateGradePolicyDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  point: number;
}

export class UpdateArrayGradePolicyDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  list_grade_policy_id: string[];

  @ApiProperty({ type: () => [CreateGradePolicyDto] })
  @ValidateNested()
  @Type(() => CreateGradePolicyDto)
  @IsNotEmpty()
  data: CreateGradePolicyDto[];
}

export class QueryGradePolicyDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  grade_policy_id: string;
}
