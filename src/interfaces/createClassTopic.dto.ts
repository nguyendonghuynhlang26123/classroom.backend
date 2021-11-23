import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateClassTopicDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class QueryClassTopicDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_topic_id: string;
}
