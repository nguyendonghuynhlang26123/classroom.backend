import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGradePolicyDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  points?: number;
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
