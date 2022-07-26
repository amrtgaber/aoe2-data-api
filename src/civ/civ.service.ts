import { Injectable } from '@nestjs/common';
import { Civ } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CivFindOptionsDto } from './dto/civ-find-options.dto';

@Injectable()
export class CivService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: CivFindOptionsDto): Promise<Civ[]> {
    const { includeUnits, includeTechs, includeBuildings } = options;

    return await this.prisma.civ.findMany({
      include: {
        units: includeUnits,
        techs: includeTechs,
        buildings: includeBuildings,
      },
    });
  }

  async findOneById(
    id: number,
    options: CivFindOptionsDto,
  ): Promise<Civ | null> {
    const { includeUnits, includeTechs, includeBuildings } = options;

    return await this.prisma.civ.findUnique({
      where: {
        id,
      },
      include: {
        units: includeUnits,
        techs: includeTechs,
        buildings: includeBuildings,
      },
    });
  }

  async findOneByName(
    name: string,
    options: CivFindOptionsDto,
  ): Promise<Civ | null> {
    const { includeUnits, includeTechs, includeBuildings } = options;

    return await this.prisma.civ.findUnique({
      where: {
        civName: name,
      },
      include: {
        units: includeUnits,
        techs: includeTechs,
        buildings: includeBuildings,
      },
    });
  }
}
