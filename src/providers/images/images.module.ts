import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../../entities/image.entity';
import { ImagekitModule } from '../imagekit/imagekit.module';
import { S3Module } from '../s3/s3.module';
import { ImageService } from './images.service';
import { ImageResloverInterceptor } from './interceptors/image-reslover-interceptors';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageEntity]),
    S3Module,
    ImagekitModule,
  ],
  providers: [ImageService, ImageResloverInterceptor],
  exports: [ImageService, ImageResloverInterceptor]
})
export class ImageModule { }
