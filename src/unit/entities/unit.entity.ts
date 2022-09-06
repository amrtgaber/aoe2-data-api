import { Unit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UnitEntity implements Unit {
  @ApiProperty()
  id: number;

  @ApiProperty()
  unitName: string;

  @ApiProperty()
  @Exclude()
  ageId: number;

  @ApiProperty()
  ages: [];

  @ApiProperty()
  civs: [];

  @ApiProperty()
  buildings: [];

  constructor(partial: Partial<UnitEntity>) {
    Object.assign(this, partial);
  }
}
