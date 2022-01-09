import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ChangePassDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsAscii()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  )
  @IsNotEmpty()
  @Length(6, 24)
  old_password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsAscii()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  )
  @IsNotEmpty()
  @Length(6, 24)
  new_password: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsAscii()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  )
  @IsNotEmpty()
  @Length(6, 24)
  confirm_password: string;
}
