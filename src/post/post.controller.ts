import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostValidation } from 'src/pipe/post.pipe';
import { StorageService } from 'src/provider/storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDotDto } from './dto/get-postDot.dto';
import { PostService } from './post.service';

// @UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly scheduleService: PostService,
    private readonly storageService: StorageService,
  ) {}

  @Get('/dot')
  async getFamilyDot() {
    const data = await this.scheduleService.getFamilyDot({ userId: 'test1' });
    return { success: true, message: '데이터', data };
  }

  @Get('/family')
  async getFamilyDailing(@Body() b: any) {
    const data = await this.scheduleService.getFamilyDailing({
      userId: 'test1',
      // date: b.date,
    });

    return { success: true, message: '데이터', data };
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile()
    image: Express.Multer.File,
    @Body()
    data: CreatePostDto,
  ) {
    const src = await this.storageService.upload(image);
    const createResult = await this.scheduleService.createPost(
      data,

      src,
    );
    if (!createResult) throw new Error('게시글 생성 실패');
    return { success: true, message: '업로드 성공', data: null };
  }
}
