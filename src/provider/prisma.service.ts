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

  async findDailingPost({
    userId,
    target,
  }: {
    userId: string;
    target?: string;
  }) {
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
                      lte: this.getEndOfDay(dayjs(target).toDate()),
                      gte: this.getStartOfDay(dayjs(target).toDate()),
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

  getKST(target?: string) {
    if (target) {
      const d = dayjs(target).add(9, 'hour').toDate();
      // console.log(d);
      return d;
    } else {
      const d = dayjs().add(9, 'hour').toDate();
      // console.log(d);
      return d;
    }
  }

  getUTC() {
    return dayjs().toDate();
  }

  private getStartOfDay(d: Date) {
    const r = dayjs(d).startOf('date').add(9, 'hour').toDate();
    console.log(`start: ${r.toUTCString()}`);
    return r;
  }

  private getEndOfDay(d: Date) {
    const r = dayjs(d).endOf('date').add(9, 'hour').toDate();
    console.log(`end: ${r.toUTCString()}`);
    return r;
  }
}
