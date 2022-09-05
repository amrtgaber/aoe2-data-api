import { Building } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BuildingEntity implements Building {
  @ApiProperty()
  id: number;

  @ApiProperty()
  buildingName: string;

  @ApiProperty()
  ageId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
