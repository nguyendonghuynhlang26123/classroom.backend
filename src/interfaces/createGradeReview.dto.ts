import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QueryGradeReviewDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  grade_review_id: string;
}

export class GradeReviewDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  student_account: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  assignment_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  grading_id: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  expect_mark: number;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsIn(['OPEN', 'REJECTED', 'APPROVED'])
  status: 'OPEN' | 'REJECTED' | 'APPROVED';
}
