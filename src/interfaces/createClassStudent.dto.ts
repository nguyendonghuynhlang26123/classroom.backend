import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryClassStudentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  student_id: string;
}

export class AccountSyncDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
