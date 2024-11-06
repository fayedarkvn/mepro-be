import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../common/entities/base.entity";
import { UserEntity } from "./user.entity";

@Entity('user_passwords')
export class UserPasswordEntity extends BaseEntity {
  @Column()
  password: string;

  @Column()
  userId: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
