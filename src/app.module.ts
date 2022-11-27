import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [AuthModule, PostModule, ImageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
