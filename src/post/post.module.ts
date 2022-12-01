import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from '../provider/prisma.service';
import { StorageService } from 'src/provider/storage.service';

@Module({
  controllers: [PostController],
  providers: [PostService, StorageService, PrismaService],
})
export class PostModule {}
