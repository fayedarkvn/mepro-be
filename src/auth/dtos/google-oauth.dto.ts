import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GoogleOAuthDto {
  @ApiProperty()
  @IsString()
  code: string;
}
