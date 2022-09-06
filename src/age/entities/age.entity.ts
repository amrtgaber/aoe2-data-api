import { Age } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AgeEntity implements Age {
  @ApiProperty()
  id: number;

  @ApiProperty()
  ageName: string;

  @ApiProperty()
  units: [];

  @ApiProperty()
  techs: [];

  @ApiProperty()
  buildings: [];

  constructor(partial: Partial<AgeEntity>) {
    Object.assign(this, partial);
  }
}
