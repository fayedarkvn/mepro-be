import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityDto } from 'src/common/dtos/base-entity.dto';
import { UserRoleEnum } from '../../entities/user.entity';

export class UserDto extends BaseEntityDto {
  @ApiProperty({ nullable: true })
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  image: string;

  @ApiPropertyOptional({ nullable: true })
  imageUrl: string;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnum;
}
