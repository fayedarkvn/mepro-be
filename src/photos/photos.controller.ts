import { Crud, CrudController, CrudRequest, Override, ParsedRequest } from '@dataui/crud';
import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, IAuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { parseImagePipe } from '../common/pipes/parse-image.pipe';
import { PhotoEntity } from '../entities/photo.entity';
import { ImageResloverInterceptor } from '../images/interceptors/image-reslover-interceptors';
import { PhotoDto } from './dtos/photo.dto';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { UploadPhotoDto } from './dtos/upload-photo.dto';
import { PhotosService } from './photos.service';

@ApiTags('photos')
@Controller('photos')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@UsePipes(ValidationPipe)
@UseInterceptors(ImageResloverInterceptor)
@Crud({
  model: {
    type: PhotoDto,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'updateOneBase', 'deleteOneBase'],
  },
  dto: {
    update: UpdatePhotoDto,
  },
  query: {
    join: {
      user: {
        eager: true,
        select: false,
      },
    }
  }
})
export class PhotosController implements CrudController<PhotoEntity> {
  constructor(
    public service: PhotosService,
  ) { }

  @Post('upload')
  @ApiOkResponse({ type: PhotoDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body() dto: UploadPhotoDto,
    @GetUser() authenticatedUser: IAuthenticatedUser,
    @UploadedFile(parseImagePipe) file: Express.Multer.File
  ) {
    return this.service.uploadPhoto(dto, authenticatedUser, file);
  }

  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
    @GetUser() authenticatedUser: IAuthenticatedUser
  ) {
    return this.service.getManyCustom(req, authenticatedUser);
  }

  @Override()
  getOne(
    @Param('id') id: string,
    @GetUser() auththenicatedUser: IAuthenticatedUser
  ) {
    return this.service.getOneCustom(id, auththenicatedUser);
  }

  @Override()
  updateOne(
    @Param('id') id: string,
    @GetUser() auththenicatedUser: IAuthenticatedUser,
    @Body() dto: UpdatePhotoDto
  ) {
    return this.service.updateOneCustom(id, auththenicatedUser, dto);
  }

  @Override()
  deleteOne(
    @Param('id') id: string,
    @GetUser() auththenicatedUser: IAuthenticatedUser
  ) {
    return this.service.deleteOneCustom(id, auththenicatedUser);
  }
}
