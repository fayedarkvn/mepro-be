import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString } from "class-validator";
import { RoleEnum } from "src/entities/user.entity";

export class LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class UserReponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: RoleEnum
  })
  role: RoleEnum;
}

export class LoginSuccessResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  @Type(() => UserReponseDto)
  user: UserReponseDto;
};
