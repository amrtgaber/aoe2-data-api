import { Injectable } from '@nestjs/common';
import { Unit } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UnitFindOptionsDto } from './dto/unit-find-options.dto';

@Injectable()
export class UnitService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: UnitFindOptionsDto): Promise<Unit[]> {
    const { includeAge, includeCivs, includeBuildings } = options;

    return await this.prisma.unit.findMany({
      include: {
        age: includeAge,
        civs: includeCivs,
        buildings: includeBuildings,
      },
    });
  }

  async findOneById(
    id: number,
    options: UnitFindOptionsDto,
  ): Promise<Unit | null> {
    const { includeAge, includeCivs, includeBuildings } = options;

    return await this.prisma.unit.findUnique({
      where: {
        id,
      },
      include: {
        age: includeAge,
        civs: includeCivs,
        buildings: includeBuildings,
      },
    });
  }

  async findOneByName(
    name: string,
    options: UnitFindOptionsDto,
  ): Promise<Unit | null> {
    const { includeAge, includeCivs, includeBuildings } = options;

    return await this.prisma.unit.findUnique({
      where: {
        unitName: name,
      },
      include: {
        age: includeAge,
        civs: includeCivs,
        buildings: includeBuildings,
      },
    });
  }
}
