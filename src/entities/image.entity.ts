import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ImageUacEnum {
  PUBLIC = 'public',
  USER_PRIVATE = 'user-private',
}

@Entity('images')
export class ImageEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ default: false })
  providerPublicAccess: boolean;

  @Column({ nullable: true })
  providerImageKey: string;

  @Column({ nullable: true })
  url: string;
}
