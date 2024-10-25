import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { AccountEntity } from './account.entity';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ default: UserRoleEnum.USER, enum: UserRoleEnum })
  role: string;

  @OneToMany(() => AccountEntity, account => account.user)
  accounts: AccountEntity[];
}
