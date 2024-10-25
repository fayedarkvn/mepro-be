import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "src/common/entities/base.entity";
import { UserEntity } from "./user.entity";

export enum AccountProviderEnum {
  GOOGLE = 'google',
  LOCAL = 'local',
}

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @Column({ nullable: true })
  type: string;

  @Column({ enum: AccountProviderEnum })
  provider: string;

  @Column({})
  providerAccountId: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  expiresAt: number;

  @Column({ nullable: true })
  tokenType: string;

  @Column({ nullable: true })
  scope: string;

  @Column({ nullable: true })
  idToken: string;

  @Column({ nullable: true })
  sessionState: string;

  @ManyToOne(() => UserEntity, user => user.accounts, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;
}
