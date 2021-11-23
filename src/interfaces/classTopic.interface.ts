import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IBase } from './base/base.interface';

export class ClassTopicInterface extends IBase {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  class_id: string;
}
