import { Injectable } from '@nestjs/common';
import { Unit } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    return await this.prisma.unit.create({
      data: {
        ...createUnitDto,
      },
    });
  }

  async findAll(): Promise<Unit[]> {
    return await this.prisma.unit.findMany();
  }

  async findOne(id: number): Promise<Unit | null> {
    return await this.prisma.unit.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUnitDto: UpdateUnitDto): Promise<Unit> {
    return await this.prisma.unit.update({
      where: {
        id,
      },
      data: {
        ...updateUnitDto,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.unit.delete({
      where: {
        id,
      },
    });
  }
}
