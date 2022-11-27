import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserDeleteDto } from './dto/user-delete.dto';
import { UserModifyDto } from './dto/user-modify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  loginUser() {}

  @Post('/signup')
  createUser(@Body() createUserDto: UserCreateDto) {}

  @Patch('/manage')
  modifyUser(@Body() userModifyDto: UserModifyDto) {}

  @Delete('/manage')
  deleteUser(@Body() userDeleteDto: UserDeleteDto) {}
}
