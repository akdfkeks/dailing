import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async userLogin(@Body() d: LoginDto) {
    const data = await this.authService.login(d);
    return { success: true, message: 'JWT Token', data };
  }

  @Post('signup')
  async userSignup(@Body() d: SignupDto) {
    const result = await this.authService.signup(d);
    if (!result) throw new Error('dasf');
    return {
      success: true,
      message: '회원가입에 성공하였습니다.',
      data: null,
    };
  }
}
