import { Injectable } from '@nestjs/common';
import { Tech } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TechFindOptionsDto } from './dto/tech-find-options.dto';

@Injectable()
export class TechService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: TechFindOptionsDto): Promise<Tech[]> {
    const { includeAge, includeCivs, includeBuildings } = options;

    return await this.prisma.tech.findMany({
      include: {
        age: includeAge,
        civs: includeCivs,
        buildings: includeBuildings,
      },
    });
  }

  async findOneById(
    id: number,
    options: TechFindOptionsDto,
  ): Promise<Tech | null> {
    const { includeAge, includeCivs, includeBuildings } = options;

    return await this.prisma.tech.findUnique({
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
    options: TechFindOptionsDto,
  ): Promise<Tech | null> {
    const { includeAge, includeCivs, includeBuildings } = options;

    return await this.prisma.tech.findUnique({
      where: {
        techName: name,
      },
      include: {
        age: includeAge,
        civs: includeCivs,
        buildings: includeBuildings,
      },
    });
  }
}
