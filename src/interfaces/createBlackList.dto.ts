import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlackListDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class ParamBlackListDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  black_list_id: string;
}
