import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLikeDto, userId: number) {
    const draft = await this.prisma.draft.findUnique({
      where: {
        id: dto.draftId,
      },
    });

    if (!draft) {
      throw new NotFoundException('draft not found');
    }

    return await this.prisma.like.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        draft: {
          connect: {
            id: dto.draftId,
          },
        },
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.like.findMany({
      where: {
        userId,
      },
      include: {
        draft: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        id,
      },
      include: {
        draft: true,
      },
    });

    if (!like || like.userId !== userId) {
      throw new NotFoundException('like not found');
    }

    return like;
  }

  async remove(id: number, userId: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        id,
      },
    });

    if (!like || like.userId !== userId) {
      throw new NotFoundException('like not found');
    }

    return await this.prisma.like.delete({
      where: {
        id,
      },
    });
  }
}
