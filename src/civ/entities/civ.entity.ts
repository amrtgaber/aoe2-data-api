import { Building, Civ, Tech, Unit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CivEntity implements Civ {
  @ApiProperty()
  id: number;

  @ApiProperty()
  civName: string;

  @ApiProperty()
  units: Unit[];

  @ApiProperty()
  techs: Tech[];

  @ApiProperty()
  buildings: Building[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
