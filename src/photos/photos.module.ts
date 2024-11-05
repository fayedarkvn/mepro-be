import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../entities/image.entity';
import { PhotoEntity } from '../entities/photo.entity';
import { UserEntity } from '../entities/user.entity';
import { ImagekitModule } from '../imagekit/imagekit.module';
import { ImagesModule } from '../images/images.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoEntity, UserEntity, ImageEntity]),
    ImagesModule,
    ImagekitModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService]

})
export class PhotosModule { }
