import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async findUniqueUser(id: string) {
    return this.user.findUnique({ where: { id: id } });
  }

  async createUser(d: { id: string; pw: string; name: string }) {
    return this.user.create({
      data: {
        id: d.id,
        pw: d.pw,
        name: d.name,
      },
    });
  }
}
