import { Building } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class BuildingEntity implements Building {
  @ApiProperty()
  id: number;

  @ApiProperty()
  buildingName: string;

  @ApiProperty()
  @Exclude()
  ageId: number;

  @ApiProperty()
  ages: [];

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
