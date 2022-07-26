import { Civ } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CivEntity implements Civ {
  @ApiProperty()
  id: number;

  @ApiProperty()
  civName: string;

  @ApiProperty()
  units: [];

  @ApiProperty()
  techs: [];

  @ApiProperty()
  buildings: [];

  constructor(partial: Partial<CivEntity>) {
    Object.assign(this, partial);
  }
}
