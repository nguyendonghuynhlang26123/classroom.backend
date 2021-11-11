import { ApiProperty } from '@nestjs/swagger';

export class GenericRes<T> {
  @ApiProperty()
  data: T[];
  @ApiProperty()
  total_page: number;
}
