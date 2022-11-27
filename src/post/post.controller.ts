import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('dailing')
export class PostController {
  constructor(private readonly scheduleService: PostService) {}

  @Get('/post/family')
  async getFamilyDailing() {
    const data = await this.scheduleService.getFamilyDailing({
      userId: 'test1',
    });

    return { success: true, message: '', data };
  }

  @Post('/post')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile()
    image: Express.Multer.File,
    data: CreatePostDto,
  ) {
    const result = await this.scheduleService.createPost(data);
    if (result) return { success: true, message: '', data: null };
  }
}
