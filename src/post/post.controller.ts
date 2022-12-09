import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
@Controller('posts')
export class PostController {
  constructor(
    private readonly scheduleService: PostService,
    private readonly storageService: StorageService,
  ) {}

  @Get('/dots')
  async getDot() {
    const data = await this.scheduleService.getPostsDot({ userId: '신형만' });
    return { success: true, message: '데이터', data };
  }

  @Post('/family')
  async getDailing(@Body() b: any) {
    const data = await this.scheduleService.getFamilyDailing({
      userId: '신형만',
      date: b.date,
    });

    return { success: true, message: 'Dailing 게시글', data };
  }

  @Get('/:id')
  async getPost(@Param('id') id: string) {
    // TODO: 가족의 게시물만 조회할 수 있도록 수정하기
    const r = await this.scheduleService.getPost({ id });

    return { success: true, message: '게시글', data: r };
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
