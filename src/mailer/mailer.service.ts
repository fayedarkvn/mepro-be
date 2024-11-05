import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Transporter, createTransport } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport';
import { Repository } from 'typeorm';
import { SentEmailEntity } from '../entities/sent-email.entity';

@Injectable()
export class MailerService {
  private transporter: Transporter;
  constructor(
    @InjectRepository(SentEmailEntity) private sentEmailRepo: Repository<SentEmailEntity>,
    configService: ConfigService,
  ) {
    this.transporter = createTransport({
      host: configService.get('mailer.host'),
      port: configService.get('mailer.port'),
      secure: configService.get('mailer.secure'),
      auth: {
        user: configService.get('mailer.user'),
        pass: configService.get('mailer.pass'),
      },
      debug: configService.get('mailer.debug'),
      from: configService.get('mailer.from'),
    });
  }

  async sendTestEmail(email: string) {
    const result = await this.transporter.sendMail({
      to: email,
      subject: "Test Email",
      text: "This is a test email",
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
