import { Age, Unit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UnitEntity implements Unit {
  @ApiProperty()
  id: number;

  @ApiProperty()
  unitName: string;

  @Exclude()
  ageId: number;

  @ApiProperty()
  age: Age;

  @ApiProperty()
  civs: [];

  @ApiProperty()
  buildings: [];

  constructor(partial: Partial<UnitEntity>) {
    Object.assign(this, partial);
  }
}
