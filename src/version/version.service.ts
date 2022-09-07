import { Injectable } from '@nestjs/common';
import { Version } from '@prisma/client';

import { VERSION_ID } from '../../prisma/seed';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VersionService {
  constructor(private prisma: PrismaService) {}

  async getVersions(): Promise<Version> {
    const versions = await this.prisma.version.findUnique({
      where: {
        id: VERSION_ID,
      },
    });

    return versions!;
  }
}
