import { Age, Building } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class BuildingEntity implements Building {
  @ApiProperty()
  id: number;

  @ApiProperty()
  buildingName: string;

  @Exclude()
  ageId: number;

  @ApiProperty()
  age: Age;

  @ApiProperty()
  civs: [];

  @ApiProperty()
  units: [];

  @ApiProperty()
  techs: [];

  constructor(partial: Partial<BuildingEntity>) {
    Object.assign(this, partial);
  }
}
