import { Injectable } from '@nestjs/common';
import { Civ } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCivDto } from './dto/create-civ.dto';
import { UpdateCivDto } from './dto/update-civ.dto';

@Injectable()
export class CivService {
  constructor(private prisma: PrismaService) {}

  async create(createCivDto: CreateCivDto): Promise<Civ> {
    return await this.prisma.civ.create({
      data: {
        ...createCivDto,
      },
    });
  }

  async findAll(): Promise<Civ[]> {
    return await this.prisma.civ.findMany({
      include: {
        units: true,
        techs: true,
        buildings: true,
      },
    });
  }

  async findOne(id: number): Promise<Civ | null> {
    return await this.prisma.civ.findUnique({
      where: {
        id,
      },
      include: {
        units: true,
        techs: true,
        buildings: true,
      },
    });
  }

  async update(id: number, updateCivDto: UpdateCivDto): Promise<Civ> {
    return await this.prisma.civ.update({
      where: {
        id,
      },
      data: {
        ...updateCivDto,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.civ.delete({
      where: {
        id,
      },
    });
  }
}
