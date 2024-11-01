import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'src/entities/image.entity';
import { ImagekitModule } from 'src/imagekit/imagekit.module';
import { S3Module } from 'src/s3/s3.module';
import { ImagesService } from './images.service';
import { ImageResloverInterceptor } from './interceptors/image-reslover-interceptors';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    S3Module,
    ImagekitModule,
  ],
  providers: [ImagesService, ImageResloverInterceptor],
  exports: [ImagesService, ImageResloverInterceptor]
})
export class ImagesModule { }
