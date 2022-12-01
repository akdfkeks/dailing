import { Controller, Get } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor() {}

  @Get()
  getUser() {
    return '';
  }
}
