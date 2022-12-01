import { Injectable } from '@nestjs/common';
import { hash, verify, argon2i } from 'argon2';

@Injectable()
export class Argon2Service {
  async hash(plain: string): Promise<string> {
    const hashed = await hash(plain, { type: argon2i });
    return hashed;
  }

  async verify(plain: string, hashed: string): Promise<boolean> {
    const result = await verify(plain, hashed, { type: argon2i });
    return result;
  }
}
