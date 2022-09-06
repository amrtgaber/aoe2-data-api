import { Injectable } from '@nestjs/common';
import { Building } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BuildingFindOptionsDto } from './dto/building-find-options.dto';

@Injectable()
export class BuildingService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: BuildingFindOptionsDto): Promise<Building[]> {
    const { includeAge, includeCivs, includeUnits, includeTechs } = options;

    return await this.prisma.building.findMany({
      include: {
        age: includeAge,
        civs: includeCivs,
        units: includeUnits,
        techs: includeTechs,
      },
    });
  }

  async findOneById(
    id: number,
    options: BuildingFindOptionsDto,
  ): Promise<Building | null> {
    const { includeAge, includeCivs, includeUnits, includeTechs } = options;

    return await this.prisma.building.findUnique({
      where: {
        id,
      },
      include: {
        age: includeAge,
        civs: includeCivs,
        units: includeUnits,
        techs: includeTechs,
      },
    });
  }

  async findOneByName(
    name: string,
    options: BuildingFindOptionsDto,
  ): Promise<Building | null> {
    const { includeAge, includeCivs, includeUnits, includeTechs } = options;

    return await this.prisma.building.findUnique({
      where: {
        buildingName: name,
      },
      include: {
        age: includeAge,
        civs: includeCivs,
        units: includeUnits,
        techs: includeTechs,
      },
    });
  }
}
