import { PostService } from 'src/post/post.service';
import { S3 } from 'aws-sdk';
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { CreatePostDto } from 'src/post/dto/create-post.dto';
import * as path from 'path';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

@Injectable()
export class StorageService implements OnModuleInit {
  private storage: S3;

  constructor(private readonly postService: PostService) {}

  onModuleInit() {
    this.storage = new S3({
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_KEY as string,
      region: 'ap-northeast-2',
    });
  }

  public async upload(file: Express.Multer.File) {
    const t = new Date().valueOf() + path.extname(file.originalname);
    console.log(t);
    try {
      const uploadResult = await this.storage
        .upload({
          Bucket: 'towncleaner',
          Key: t,
          Body: await this.compress(file.buffer),
        })
        .promise();
      // console.log(uploadResult);
      return uploadResult.Location;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException('이미지 업로드 실패');
    }
  }

  private compress(image: Buffer) {
    try {
      return sharp(image).resize({ width: 1920 }).withMetadata().toBuffer();
    } catch (err) {
      throw new InternalServerErrorException('이미지 압축 실패');
    }
  }
}
