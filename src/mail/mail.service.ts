import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport';
import { Repository } from 'typeorm';
import { SentEmailEntity } from '../entities/sent-email.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(SentEmailEntity) private sentEmailRepo: Repository<SentEmailEntity>,
    private mailerService: MailerService,
  ) { }

  async sendTestEmail(email: string) {
    const result = await this.mailerService.sendMail({
      to: email,
      subject: "Test Email",
      template: 'test.hbs',
    }) as SentMessageInfo;

    await this.saveSentEmail(result);

    return result;
  }

  async saveSentEmail(result: SentMessageInfo) {
    const { messageId, accepted, rejected, pending, response, envelope, ...extra } = result;
    const sentEmail = this.sentEmailRepo.create({
      envelope,
      messageId,
      accepted,
      rejected,
      pending,
      response,
      extra,
    });

    return await this.sentEmailRepo.save(sentEmail);
  }
}
