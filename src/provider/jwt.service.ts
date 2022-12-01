import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  // token을 decode후 req.user에 붙여서 넘어갑니다.
  // 만약 토큰이 없거나 유효하지 않으면 req.user에는 null 값이 들어갑니다.
  public async use(req: Request, res: Response, next: () => void) {
    req.user = await this.verifyUser(req);
    return next();
  }

  private async verifyUser(req: Request): Promise<number> {
    let user = null;
    try {
      const { authorization } = req.headers;
      const token = authorization.replace('Bearer ', '').replace('bearer ', '');
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {}

    return user;
  }
}
