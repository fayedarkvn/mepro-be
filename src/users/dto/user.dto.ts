import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../entities/user.entity';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: UserRoleEnum
  })
  role: string;
}
