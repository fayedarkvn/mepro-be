import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from '../common/entities/base.entity';
import { UserEntity } from "./user.entity";

export enum AccountProviderEnum {
  GOOGLE = 'google',
  LOCAL = 'local',
}

@Entity('account')
export class AccountEntity extends BaseEntity {
  @Column({ enum: AccountProviderEnum })
  provider: string;

  @Column({ nullable: true })
  providerAccountId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  emailVerified: boolean;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  tokenType: string;

  @Column({ nullable: true })
  scope: string;

  @Column({ nullable: true })
  idToken: string;

  @Column({ nullable: true })
  sessionState: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;
}
