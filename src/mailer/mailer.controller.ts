import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { MailerService } from './mailer.service';

@Controller('mail')
@ApiTags('mail')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
export class MailerController {
  constructor(private service: MailerService) { }

  @Get("send-test")
  sendMail(@Query("email") email: string) {
    return this.service.sendTestEmail(email);
  }
}
