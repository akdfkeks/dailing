import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../provider/prisma.service';
import { FindFamilyPostDto } from './dto/find-familyPost.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPostsDot({ userId }) {
    const members = await this.prisma.findAllFamilyPost({ userId });

    let postExistUser: {
      userId: string;
      dateList: string[];
    }[] = [];

    let p = new Map<string, string[]>();

    members.forEach((user) => {
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

  async getFamilyDailing({ userId }) {
    const today = this.prisma.getKST();
    const members = await this.prisma.findDailingPost({ userId, today });
    let r = [];
    members.forEach((member) => {
      if (member.post.length > 0) {
        r.push({
          userId: member.id,
          name: member.name,
          profile: member.profile,
          post: member.post,
        });
      }
    });
    // console.log(r);
    return r;
  }

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
        createdAt: this.prisma.getKST(),
      },
    });

    if (!result) return false;
    return true;
  }

  async getPost({ id }: { id: string }) {
    const r = await this.prisma.post.findUnique({
      where: {
        uuid: id,
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
