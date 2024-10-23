import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ default: UserRoleEnum.USER, enum: UserRoleEnum })
  role: string;

  @OneToMany(() => AccountEntity, account => account.user)
  accounts: AccountEntity[];
}
