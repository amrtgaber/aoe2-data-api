import { Injectable } from '@nestjs/common';
import { Tech } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

@Injectable()
export class TechService {
  constructor(private prisma: PrismaService) {}

  async create(createTechDto: CreateTechDto): Promise<Tech> {
    return await this.prisma.tech.create({
      data: {
        ...createTechDto,
      },
    });
  }

  async findAll(): Promise<Tech[]> {
    return await this.prisma.tech.findMany();
  }

  async findOne(id: number): Promise<Tech | null> {
    return await this.prisma.tech.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateTechDto: UpdateTechDto): Promise<Tech> {
    return await this.prisma.tech.update({
      where: {
        id,
      },
      data: {
        ...updateTechDto,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.tech.delete({
      where: {
        id,
      },
    });
  }
}
