import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';

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

  async findAllFamilyPost({ userId }) {
    const {
      family: { user },
    } = await this.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        family: {
          include: {
            user: {
              include: {
                post: {
                  where: {},
                  select: {
                    uuid: true,
                    title: true,
                    content: true,
                    image: true,
                    lat: true,
                    lng: true,
                    createdAt: true,
                  },
                  orderBy: {
                    createdAt: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    return user;
  }

  async findDailingPost({ userId, today }: { userId: string; today?: Date }) {
    const {
      family: { user },
    } = await this.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        family: {
          include: {
            user: {
              include: {
                post: {
                  where: {
                    createdAt: {
                      lte: today ? this.getEndOfDay(today) : null,
                      gte: today ? this.getStartOfDay(today) : null,
                    },
                  },
                  select: {
                    uuid: true,
                    title: true,
                    content: true,
                    image: true,
                    lat: true,
                    lng: true,
                    createdAt: true,
                  },
                  orderBy: {
                    createdAt: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    return user;
  }

  getKST() {
    return dayjs().add(9, 'hour').toDate();
  }

  getUTC() {
    return dayjs().toDate();
  }

  getStartOfDay(d: Date) {
    return dayjs(d).startOf('day').toDate();
  }
  getEndOfDay(d: Date) {
    return dayjs(d).endOf('day').toDate();
  }
}
