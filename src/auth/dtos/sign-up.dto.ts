import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { UserDto } from "src/users/dto/user.dto";

export class SignUpDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SignUpSuccessResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  @Type(() => UserDto)
  user: UserDto;
};
