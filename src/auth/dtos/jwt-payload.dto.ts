import { Equals, IsEmail, IsIn, IsInt, IsNumber, Validate } from 'class-validator';
import { UserRoleEnum } from 'src/entities/user.entity';

export class JwtPayloadDto {
  @IsNumber()
  sub: number;

  @IsInt()
  iat: number;

  @IsInt()
  @Validate((exp: number) => exp > Math.floor(Date.now() / 1000), {
    message: 'Token has expired',
  })
  exp: number;
}

export class UserJwtPayloadDto extends JwtPayloadDto {
  @IsEmail()
  email: string;

  @IsIn(Object.values(UserRoleEnum))
  role: string;

  @Equals("auth")
  service: "auth";
}

export class ImgJwtPayloadDto extends JwtPayloadDto {
  @Equals("image")
  service: "image";
}
