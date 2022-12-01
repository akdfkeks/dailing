import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';

@Controller('/')
export class AppController {
  constructor() {}

  @Get()
  getHome(): string {
    return 'Hello NestJS';
  }

  @UseGuards(AuthGuard)
  @Post()
  postHomeWithGuard(@Req() req) {
    return req.user;
  }
}
