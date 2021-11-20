import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ClassTopicInterface {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;
}
