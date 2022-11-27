import { Injectable } from '@nestjs/common';
import { PrismaService } from '../provider/prisma.service';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
}
