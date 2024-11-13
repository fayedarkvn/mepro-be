import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../entities/image.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { UserEntity } from '../entities/user.entity';
import { ImagekitModule } from '../providers/imagekit/imagekit.module';
import { ImageModule } from '../providers/images/images.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoEntity, UserEntity, ImageEntity]),
    ImageModule,
    ImagekitModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService],

})
export class PhotosModule { }
