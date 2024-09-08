import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { IsUnique } from "src/common/validators/is-unique.validator";
import { RoleEnum, UserEntity } from "src/entities/user.entity";

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
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
