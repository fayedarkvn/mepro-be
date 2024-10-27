import { ApiProperty } from '@nestjs/swagger';

export class BaseEntityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
