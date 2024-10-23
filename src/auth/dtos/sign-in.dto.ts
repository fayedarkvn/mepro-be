import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { UserDto } from "src/users/dto/user.dto";

export class SignInDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SignInSuccessResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  @Type(() => UserDto)
  user: UserDto;
};
