import { Injectable } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RequestPresigningArguments } from "@smithy/types";

@Injectable()
export class S3Service {
  public client: S3Client;
  private bucketName: string;
  private folder: string;

  constructor(
    configService: ConfigService,
  ) {
    this.client = new S3Client({
      region: configService.get("s3.region"),
      credentials: {
        accessKeyId: configService.get("s3.accessKeyId"),
        secretAccessKey: configService.get("s3.secretAccessKey"),
      },
    });

    this.bucketName = configService.get("s3.bucketName");
    this.folder = configService.get("s3.folder", "mepro/");
  }

  async generatePreSignedUrls(keys: string[], options?: RequestPresigningArguments) {
    const urlPromises = keys.map((key) => this.generatePreSignedUrl(key, options));

    const result = await Promise.allSettled(urlPromises);

    return result.map((result) => result.status === 'fulfilled' ? result.value : null);
  }

  async generatePreSignedUrl(key: string, options?: RequestPresigningArguments) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return getSignedUrl(this.client, command, options);
  }

  async generatePutObjectPresignedUrl(key: string, options?: RequestPresigningArguments) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: this.folder + key,
    });

    return await getSignedUrl(this.client, command, options);;
  };
}
