import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { argon2i, hash, verify } from 'argon2';
import { PrismaService } from 'src/provider/prisma.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { SignupDto } from 'src/auth/dto/signup.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(d: LoginDto) {
    const user = await this.prisma.findUniqueUser(d.id);
    if (!user) throw new NotFoundException('ID 를 확인해주세요');

    if (!(await this.pwVerify(d.pw, user.pw)))
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const { uuid, pw, familyId, ...payload } = user;

    return this.createJwt(payload);
  }

  async signup(d: SignupDto) {
    const user = await this.prisma.findUniqueUser(d.id);
    if (user) throw new Error('이미 사용중인 ID 입니다.');

    return this.prisma.createUser({
      id: d.id,
      pw: await this.hash(d.pw),
      name: d.name,
    });
  }

  private async hash(plain: string): Promise<string> {
    const hashed = await hash(plain, { type: argon2i });
    return hashed;
  }

  private async pwVerify(plain: string, hashed: string): Promise<boolean> {
    const result = await verify(hashed, plain, { type: argon2i });
    return result;
  }

  private createJwt(payload: { id: string; name: string }) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  public async jwtVerify(token: string) {
    try {
      // const payload = jwt.verify(token, process.env.JWT_SECRET) as (
      //   | jwt.JwtPayload
      //   | string
      // ) & { id: string; name: string };

      // const { id, name } = payload;
      const payload = jwt.verify(token, process.env.JWT_SECRET, {});

      return payload;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}
