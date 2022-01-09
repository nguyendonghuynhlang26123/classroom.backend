import { ApiProperty } from '@nestjs/swagger';
import { IBase } from './base/base.interface';

export class DeviceInterface extends IBase {
  @ApiProperty()
  socket_id: string;
  @ApiProperty()
  user_id: string;
}
