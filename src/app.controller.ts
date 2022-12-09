import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
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
  postHomeWithGuard(@Request() req: any) {
    return req.user;
  }
}
