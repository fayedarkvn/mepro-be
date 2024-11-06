import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: UserRoleEnum.USER, enum: UserRoleEnum })
  role: string;
}
