import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityDto } from 'src/common/dtos/base-entity.dto';
import { UserEntity, UserRoleEnum } from '../../entities/user.entity';

export class UserDto extends BaseEntityDto implements Pick<UserEntity, 'name' | 'email' | 'image' | 'role'> {
  @ApiProperty({ nullable: true })
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  image: string | null;

  @ApiProperty({ enum: UserRoleEnum })
  role: UserRoleEnum;
}
