import { ApiProperty } from '@dataui/crud/lib/crud';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithBigintIdDto } from '../../common/dtos/base-entity.dto';

export class PhotoDto extends BaseEntityWithBigintIdDto {
  @ApiProperty({ nullable: true })
  title: string;

  @ApiProperty({ nullable: true })
  labels: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  user_id: number;

  @ApiPropertyOptional({ nullable: true })
  imageUrl: string;

  @ApiPropertyOptional({ nullable: true })
  imageProvider: string;
}
