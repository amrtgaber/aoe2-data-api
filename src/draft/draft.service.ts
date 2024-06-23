import { Injectable, NotFoundException } from '@nestjs/common';
import { Civ } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';

@Injectable()
export class DraftService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDraftDto, userId: number) {
    return await this.prisma.draft.create({
      data: {
        name: dto.name,
        desc: dto.desc,
        private: dto.private,
        owner: {
          connect: {
            id: userId,
          },
        },
        civs: {
          connect: dto.civs,
        },
      },
      include: {
        civs: true,
        _count: {
          select: { likes: true },
        },
      },
    });
  }

  async findAll(userId: number) {
    return await this.prisma.draft.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        civs: true,
        _count: {
          select: { likes: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const draft = await this.prisma.draft.findUnique({
      where: {
        id,
      },
      include: {
        civs: true,
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!draft || draft.private) {
      throw new NotFoundException('draft not found');
    }

    return draft;
  }

  async update(id: number, dto: UpdateDraftDto, userId: number) {
    const oldDraft = await this.prisma.draft.findUnique({
      where: {
        id,
      },
      include: {
        civs: true,
      },
    });

    if (!oldDraft || oldDraft.ownerId !== userId) {
      throw new NotFoundException('draft not found');
    }

    let civs: Civ[];
    if (dto.civs && dto.civs.length > 0) {
      civs = dto.civs;
    } else {
      civs = oldDraft.civs;
    }

    return await this.prisma.draft.update({
      where: {
        id,
      },
      data: {
        name: dto.name ?? oldDraft.name,
        desc: dto.desc ?? oldDraft.desc,
        private: dto.private ?? oldDraft.private,
        civs: {
          disconnect: oldDraft.civs.map((civ) => ({ id: civ.id })),
          connect: civs,
        },
      },
      include: {
        civs: true,
        _count: {
          select: { likes: true },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const draft = await this.prisma.draft.findUnique({
      where: {
        id,
      },
    });

    if (!draft || draft.ownerId !== userId) {
      throw new NotFoundException('draft not found');
    }

    return await this.prisma.draft.delete({
      where: {
        id,
      },
    });
  }
}
