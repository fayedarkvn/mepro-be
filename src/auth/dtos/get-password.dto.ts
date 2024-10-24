import { ApiProperty } from "@nestjs/swagger";

export class GetPasswordResponseDto {
  @ApiProperty({ nullable: true })
  updateAt: Date;
}
