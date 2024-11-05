import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class SignInDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
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
}
