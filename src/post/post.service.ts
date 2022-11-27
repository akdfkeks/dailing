import { Injectable } from '@nestjs/common';
import { PrismaService } from '../provider/prisma.service';
import { FindFamilyPostDto } from './dto/find-familyPost.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: CreatePostDto) {
    const result = await this.prisma.post.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        title: data.title,
        content: data.content,
        image: '',
        lat: 0,
        lng: 0,
      },
    });

    if (!result) return false;
    return true;
  }

  async getFamilyDailing(data: FindFamilyPostDto) {
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
    const userListWithPost = r.family.user.map((user) => {
      return {
        userId: user.id,
        name: user.name,
        post: user.post,
      };
    });

    return {
      familyId: r.family.uuid,
      familyName: r.family.name,
      familyMember: userListWithPost,
    };
  }
}
