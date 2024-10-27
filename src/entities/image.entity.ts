import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

export enum ImageUacEnum {
  PUBLIC = 'public',
  USER_PRIVATE = 'user-private',
}

export enum ImageProviderEnum {
  S3 = 's3',
  LOCAL = 'local',
  OTHER = 'other',
}

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Column()
  imageId: string;

  @Column({ enum: ImageProviderEnum })
  provider: string;

  @Column({ default: false })
  providerPublicAccess: boolean;

  @Column({ nullable: true })
  providerImageId: string;

  @Column({ nullable: true })
  providerPriority: number;

  @Column({ enum: ImageUacEnum })
  uac: string;

  @Column({ nullable: true })
  url: string;
}
