import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Column, Entity } from 'typeorm';
import { JsonColumn } from '../common/decorators/json-column.decorator';
import { BaseEntityWithBigintId } from '../common/entities/base.entity';

@Entity('sent_email')
export class SentEmailEntity extends BaseEntityWithBigintId {
  @Column({ nullable: true })
  messageId: string;

  @JsonColumn({ nullable: true })
  envelope: SentMessageInfo['envelope'];

  @JsonColumn({ nullable: true })
  accepted: SentMessageInfo['accepted'];

  @JsonColumn({ nullable: true })
  rejected: SentMessageInfo['rejected'];

  @JsonColumn({ nullable: true })
  pending: SentMessageInfo['pending'];

  @JsonColumn({ nullable: true })
  response: SentMessageInfo['response'];

  @JsonColumn({ nullable: true })
  extra: any;
}
