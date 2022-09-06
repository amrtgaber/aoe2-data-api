import { Injectable } from '@nestjs/common';
import { Age } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AgeFindOptionsDto } from './dto/age-find-options.dto';

@Injectable()
export class AgeService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: AgeFindOptionsDto): Promise<Age[]> {
    const { includeUnits, includeTechs, includeBuildings } = options;

    return await this.prisma.age.findMany({
      include: {
        units: includeUnits,
        techs: includeTechs,
        buildings: includeBuildings,
      },
    });
  }

  async findOneById(
    id: number,
    options: AgeFindOptionsDto,
  ): Promise<Age | null> {
    const { includeUnits, includeTechs, includeBuildings } = options;

    return await this.prisma.age.findUnique({
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
    options: AgeFindOptionsDto,
  ): Promise<Age | null> {
    const { includeUnits, includeTechs, includeBuildings } = options;

    return await this.prisma.age.findUnique({
      where: {
        ageName: name,
      },
      include: {
        units: includeUnits,
        techs: includeTechs,
        buildings: includeBuildings,
      },
    });
  }
}
