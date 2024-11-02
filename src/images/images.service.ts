import { flatten, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { partition } from 'lodash';
import { IMAGE_PROVIDER } from 'src/common/constrains/image';
import { ImageEntity } from 'src/entities/image.entity';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { S3Service } from 'src/s3/s3.service';
import { In, Repository } from 'typeorm';
import { createHash } from 'crypto';

export type IImageKeys = { [key: string]: string; };
export type IImageKeysArray = IImageKeys[];
export type IReslovedUrls = { [key: string]: string; };
export type IReslovedUrlsArray = IReslovedUrls[];

@Injectable()
export class ImagesService {
  enabledProviders: string[];
  providerPriority: { [key: string]: number; };
  constructor(
    @InjectRepository(ImageEntity) private imageRepo: Repository<ImageEntity>,
    private s3Service: S3Service,
    private imagekitService: ImagekitService,
    configService: ConfigService,
  ) {
    const enabledProviders = [IMAGE_PROVIDER.DEFAULT as string].concat(configService.get<string[]>('image.fallbackImageProviders'));
    this.enabledProviders = enabledProviders;

    const providerPriority = enabledProviders.reduce((acc, provider, index) => {
      acc[provider] = index;
      return acc;
    }, {} as { [key: string]: number; });
    this.providerPriority = providerPriority;

    const logger = new Logger('ImagesService');
    logger.log(`Enabled image providers: ${enabledProviders}`);
  }

  async uploadImage(file: Express.Multer.File) {
    const fileHash = createHash('md5').update(file.buffer).digest('base64url');

    const existingImage = await this.imageRepo.findOne({
      where: { key: fileHash }
    });

    if (existingImage) {
      return existingImage;
    }

    const uploadResponse = await this.imagekitService.client.upload({
      file: file.buffer,
      fileName: fileHash,
      folder: "default",
    });

    const image = this.imageRepo.create({
      key: fileHash,
      providerImageKey: uploadResponse.filePath,
      provider: IMAGE_PROVIDER.IMAGEKIT,
    });

    await this.imageRepo.save(image);
    return image;
  }

  async updateImageForObject(data: { [key: string]: any; }) {
    const imageKeys = this.getImageKeysInObject(data);
    const reslovedUrls = await this.resloveImageKeys(imageKeys);
    for (const [key, value] of Object.entries(reslovedUrls)) {
      data[key] = value;
    }
  }

  async updateImageForArray(data: any[]) {
    const imageKeysArray = data.map((item) => this.getImageKeysInObject(item));
    const reslovedUrlsArray = await this.resloveImageKeysArray(imageKeysArray);
    data.forEach((item, index) => {
      for (const [key, value] of Object.entries(reslovedUrlsArray[index])) {
        item[key] = value;
      }
    });
  }

  async resolveImageForObject(data: { [key: string]: any; }) {
    const imageKeys = this.getImageKeysInObject(data);
    const reslovedUrls = await this.resloveImageKeys(imageKeys);
    return { ...data, ...reslovedUrls };
  };

  async resolveImageForArray(data: any[]) {
    const imageKeysArray = data.map((item) => this.getImageKeysInObject(item));
    const reslovedUrlsArray = await this.resloveImageKeysArray(imageKeysArray);
    return data.map((item, index) => ({ ...item, ...reslovedUrlsArray[index] }));
  };

  async resloveImageKeys(imageKeys: IImageKeys): Promise<IReslovedUrls> {
    const keys = Object.keys(imageKeys);
    const ids = Object.values(imageKeys);

    const images = await this.selectByImageKeys(ids);
    const reslovedImages = await this.resloveImage(images);

    return this.mapImageToObejct(keys, reslovedImages, imageKeys);;
  }

  async resloveImageKeysArray(imageKeysArray: IImageKeys[]): Promise<IReslovedUrlsArray> {
    const ids = flatten(imageKeysArray.map(imageKeys => Object.values(imageKeys)));
    const images = await this.selectByImageKeys(ids);
    const reslovedImages = await this.resloveImage(images);

    const reslovedArray = imageKeysArray.map(imageKeys => {
      const keys = Object.keys(imageKeys);
      return this.mapImageToObejct(keys, reslovedImages, imageKeys);
    });

    return reslovedArray;
  }

  async resloveImage(images: ImageEntity[]): Promise<ImageEntity[]> {
    const [privateImages, publicImages] = partition(images, { providerPublicAccess: false });

    const s3Images = [];
    const imagekitImages = [];
    const otherImages = [];

    for (const image of privateImages) {
      switch (image.provider) {
        case IMAGE_PROVIDER.S3:
          s3Images.push(image);
          break;
        case IMAGE_PROVIDER.IMAGEKIT:
          imagekitImages.push(image);
          break;
        default:
          otherImages.push(image);
      }
    }

    if (s3Images.length > 0) {
      const s3Urls = await this.s3Service.generatePreSignedUrls(s3Images.map(image => image.providerImageKey));
      s3Images.forEach((image, index) => image.url = s3Urls[index]);
    }

    if (imagekitImages.length > 0) {
      const imagekitUrls = this.imagekitService.generateSignedUrls(imagekitImages.map(image => image.providerImageKey));
      imagekitImages.forEach((image, index) => image.url = imagekitUrls[index]);
    }

    return publicImages.concat(s3Images, imagekitImages, otherImages);
  }

  async selectByImageKeys(keys: string[]): Promise<ImageEntity[]> {
    if (keys.length === 0 || this.enabledProviders.length === 0) {
      return [];
    }

    const entities = await this.imageRepo.find({
      where: [
        { key: In(keys), provider: In(this.enabledProviders) },
        { key: In(keys), providerPublicAccess: true },
      ]
    });

    const result: { [key: string]: ImageEntity; } = {};

    entities.forEach((image) => {
      const existingImage = result[image.key];
      if (
        !existingImage ||
        this.providerPriority[image.provider] < this.providerPriority[existingImage.provider]
      ) {
        result[image.key] = image;
      }
    });

    return Object.values(result);
  }

  private getImageKeysInObject(data: { [key: string]: any; }) {
    const imageKeys: { [key: string]: string; } = {};
    for (const [key, value] of Object.entries(data)) {
      if (/^.*[Ii]mage$/.test(key) && value) {
        imageKeys[key] = value;
      }
    }
    return imageKeys;
  }

  private mapImageToObejct(keys: string[], images: ImageEntity[], imageKeys: IImageKeys): IReslovedUrls {
    return keys.reduce((acc, key) => {
      const image = images.find(image => image.key === imageKeys[key]);
      if (key == "image") {
        acc["imageUrl"] = image?.url || null;
        acc["imageProvider"] = image?.provider || null;
        return acc;
      } else {
        const propertyName = key.replace(/Image$/, '');
        acc[propertyName + "ImageUrl"] = image?.url || null;
        acc[propertyName + "ImageProvider"] = image?.provider || null;
        return acc;
      }
    }, {} as IReslovedUrls);
  }
}
