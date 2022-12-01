import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../provider/prisma.service';
import { FindFamilyPostDto } from './dto/find-familyPost.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getFamilyDot(data: { userId: string }) {
    const {
      family: { user },
    } = await this.getFamilyPost(data);

    let postExistUser: {
      userId: string;
      dateList: string[];
    }[] = [];

    let p = new Map<string, string[]>();

    user.forEach((user) => {
      if (user.post.length > 0) {
        const d = {
          userId: user.id,
          dateList: user.post.map((post) => {
            return toStringByFormatting(post.createdAt);
          }),
        };

        postExistUser.push(d);
      }
    });

    if (postExistUser.length < 1) {
      throw new NotFoundException('데이터가 없어용');
    }

    postExistUser.forEach((user) => {
      user.dateList.forEach((date) => {
        p.set(
          date,
          p.get(date)
            ? [...new Set(p.get(date).concat([user.userId]))]
            : [...new Set([user.userId])],
        );
      });
    });

    const r = Array.from(p, ([date, userList]) => ({ date, userList }));

    return r;
  }

  async getFamilyDailing(data: { userId: string; date: string }) {}

  async createPost(data: CreatePostDto, src?: string) {
    const result = await this.prisma.post.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        title: data.title,
        content: data.content,
        image: src ? src : '',
        lat: 0,
        lng: 0,
      },
    });

    if (!result) return false;
    return true;
  }

  // async getFamilyDailing(data: FindFamilyPostDto) {
  //   const r = await this.getFamilyPost(data);
  //   const userListWithPost = r.family.user.map((user) => {
  //     return {
  //       userId: user.id,
  //       name: user.name,
  //       post: user.post,
  //     };
  //   });

  //   return {
  //     // familyId: r.family.uuid,
  //     // familyName: r.family.name,
  //     familyMember: userListWithPost,
  //   };
  // }

  private async getFamilyPost(data: FindFamilyPostDto) {
    const r = await this.prisma.user.findUnique({
      where: {
        id: data.userId,
      },
      include: {
        family: {
          include: {
            user: {
              include: {
                post: {
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

    return r;
  }
}

function toStringByFormatting(source, delimiter = '-') {
  const year = source.getFullYear();
  const month = leftPad(source.getMonth() + 1);
  const day = leftPad(source.getDate());

  return [year, month, day].join(delimiter);
}

function leftPad(value) {
  if (value >= 10) {
    return value;
  }

  return `0${value}`;
}
