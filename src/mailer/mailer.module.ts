import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentEmailEntity } from '../entities/sent-email.entity';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SentEmailEntity])
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule { }
