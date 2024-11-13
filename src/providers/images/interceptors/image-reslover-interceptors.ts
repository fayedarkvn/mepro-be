import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ImageService } from '../images.service';

@Injectable()
export class ImageResloverInterceptor<T> implements NestInterceptor<T> {
  constructor(
    private imagesService: ImageService
  ) { }

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(async (data) => {
        if (data && typeof data === "object") {
          if (data.data && Array.isArray(data.data)) {
            data["data"] = await this.imagesService.resolveImageForArray(data["data"]);
            return data;
          }
          else if (data["data"] && typeof data["data"] === "object") {
            data["data"] = await this.imagesService.resolveImageForObject(data["data"]);
            return data;
          }
          else if (Array.isArray(data)) {
            return await this.imagesService.resolveImageForArray(data);
          }
          else {
            return await this.imagesService.resolveImageForObject(data);
          }
        }

        return data;
      })
    );
  }
}
