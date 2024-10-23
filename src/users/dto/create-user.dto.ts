import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";
import { IsUnique } from "src/common/validators/is-unique.validator";
import { UserEntity, UserRoleEnum } from "src/entities/user.entity";

export class CreateUserDto {
  @ApiProperty({})
  @IsString()
  @IsUnique(UserEntity, 'username', { message: 'Username is already in use.' })
  username: string;

  @ApiProperty({})
  @IsString()
  @IsUnique(UserEntity, 'email', { message: 'Email is already in use.' })
  email: string;

  @ApiProperty({})
  @IsString()
  password: string;

  @ApiProperty({
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
