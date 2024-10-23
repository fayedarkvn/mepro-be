import { CreateDateColumn, PrimaryGeneratedColumn, BaseEntity as TypeOrmBaseEntity, UpdateDateColumn } from "typeorm";

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
