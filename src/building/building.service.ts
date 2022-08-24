import { Injectable } from '@nestjs/common';
import { Building } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(private prisma: PrismaService) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    return await this.prisma.building.create({
      data: {
        ...createBuildingDto,
      },
    });
  }

  async findAll(): Promise<Building[]> {
    return await this.prisma.building.findMany({
      include: {
        civs: true,
      },
    });
  }

  async findOne(id: number): Promise<Building | null> {
    return await this.prisma.building.findUnique({
      where: {
        id,
      },
      include: {
        civs: true,
      },
    });
  }

  async update(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    return await this.prisma.building.update({
      where: {
        id,
      },
      data: {
        ...updateBuildingDto,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.building.delete({
      where: {
        id,
      },
    });
  }
}
