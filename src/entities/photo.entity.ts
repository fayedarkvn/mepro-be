import { BaseEntityWithBigintId } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('photos')
export class PhotoEntity extends BaseEntityWithBigintId {
  @Column({nullable: true})
  title: string;

  @Column({ nullable: true })
  labels: string;

  @ManyToOne(() => UserEntity, user => user.photos)
  user: UserEntity;

  @Column()
  image: string;
}
