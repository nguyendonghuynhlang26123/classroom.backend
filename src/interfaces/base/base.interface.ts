import { ApiProperty } from "@nestjs/swagger";

export class IBase {
  @ApiProperty()
  _id?: string;
  @ApiProperty()
  updated_at?: number;
  @ApiProperty()
  created_at?: number;
  @ApiProperty()
  deleted_at?: number;
}
