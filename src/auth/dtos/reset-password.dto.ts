import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsUrl } from 'class-validator';

export class MailResetPasswordDto {
  @ApiProperty()
  @IsUrl({ require_tld: false, require_protocol: true })
  endpointUrl: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;
}

export class ResetPasswordConfirm {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
