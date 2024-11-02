import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoEntity } from 'src/entities/photo.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ImagekitModule } from 'src/imagekit/imagekit.module';
import { ImagesModule } from 'src/images/images.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { ImageEntity } from 'src/entities/image.entity';

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
