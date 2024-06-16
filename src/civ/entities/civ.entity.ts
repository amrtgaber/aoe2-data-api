import { Civ } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

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

  @Exclude()
  drafts?: [];

  constructor(partial: Partial<CivEntity>) {
    Object.assign(this, partial);
  }
}
