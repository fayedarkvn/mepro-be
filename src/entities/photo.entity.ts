import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityWithBigintId } from '../common/entities/base.entity';
import { UserEntity } from './user.entity';

@Entity('photos')
export class PhotoEntity extends BaseEntityWithBigintId {
  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  labels: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;

  @Column()
  image: string;
}
