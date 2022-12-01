import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { PostModule } from './post/post.module';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './provider/prisma.service';
import { AuthTokenMiddleware } from './provider/jwt.service';

@Module({
  imports: [PostModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [
    PrismaService,
    AuthService,
    { provide: APP_PIPE, useClass: ValidationPipe },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
