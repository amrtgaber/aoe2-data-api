import { Version } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VersionEntity implements Version {
  @ApiProperty()
  id: number;

  @ApiProperty()
  gameVersion: string;

  @ApiProperty()
  apiVersion: string;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<VersionEntity>) {
    Object.assign(this, partial);
  }
}
