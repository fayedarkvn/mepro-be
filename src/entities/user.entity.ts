import { Exclude } from "class-transformer";
import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from 'bcrypt';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

const SALT_ROUND = 10;

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: RoleEnum.USER, enum: RoleEnum })
  role: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, SALT_ROUND);
    return hash === this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Check if password is not already hashed
    if (this.password) {
      const salt = await bcrypt.genSalt(SALT_ROUND);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
