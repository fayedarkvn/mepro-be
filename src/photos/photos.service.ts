import { CrudRequest } from '@dataui/crud';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { IAuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { PhotoEntity } from '../entities/photo.entity';
import { ImageService } from '../providers/images/images.service';
import { PhotoDto } from './dtos/photo.dto';
import { UploadPhotoDto } from './dtos/upload-photo.dto';

@Injectable()
export class PhotosService extends TypeOrmCrudService<PhotoEntity> {
  constructor(
    @InjectRepository(PhotoEntity) private photoRepo: Repository<PhotoEntity>,
    private imageService: ImageService,

  ) {
    super(photoRepo);
  }

  async uploadPhoto(dto: UploadPhotoDto, authenticatedUser: IAuthenticatedUser, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const image = await this.imageService.uploadImage(file);

    const photo = this.photoRepo.create({
      title: dto.title ?? file.originalname,
      labels: dto.labels,
      user: authenticatedUser,
      image: image.key,
    });
    await this.photoRepo.save(photo);

    return plainToClass(PhotoDto, photo);
  }

  getManyCustom(req: CrudRequest, authenticatedUser: IAuthenticatedUser) {
    req.parsed.search.$and.push({
      'user.id': {
        $eq: authenticatedUser.id,
      },
    });

    return this.getMany(req);
  }

  async getOneCustom(id: string, authenticatedUser: IAuthenticatedUser) {
    const photo = await this.findPhotoWithUser(id, authenticatedUser.id);

    return plainToClass(PhotoDto, photo);
  }

  async updateOneCustom(id: string, authenticatedUser: IAuthenticatedUser, dto: any) {
    const photo = await this.findPhotoWithUser(id, authenticatedUser.id);
    Object.assign(photo, dto);
    await this.photoRepo.save(photo);
    return plainToClass(PhotoDto, photo);
  }

  async deleteOneCustom(id: string, authenticatedUser: IAuthenticatedUser) {
    const photo = await this.findPhotoWithUser(id, authenticatedUser.id);
    await this.photoRepo.delete(photo.id);
  }

  async findPhotoWithUser(id: string, userId: number) {
    return this.photoRepo.findOneOrFail({
      where: {
        id,
        user: { id: userId },
      },
    }).catch(() => {
      throw new NotFoundException('Photo not found');
    });
  }
}
