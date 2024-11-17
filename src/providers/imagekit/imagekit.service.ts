import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import { UrlOptions } from 'imagekit/dist/libs/interfaces';

@Injectable()
export class ImagekitService {
  public client: ImageKit;
  constructor(
    configService: ConfigService,
  ) {
    this.client = new ImageKit({
      publicKey: configService.get('imagekit.publicKey'),
      privateKey: configService.get('imagekit.privateKey'),
      urlEndpoint: configService.get('imagekit.urlEndpoint'),
    });
  }

  generateSignedUrls(keys: string[], options?: UrlOptions) {
    return keys.map(key => this.generateSignedUrl(key, options));
  }

  generateSignedUrl(key: string, options?: UrlOptions) {
    return this.client.url(Object.assign({
      path: key,
      signed: true,
    }, options));
  }
}
