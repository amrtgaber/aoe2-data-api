import { Building } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BuildingEntity implements Building {
  @ApiProperty()
  id: number;

  @ApiProperty()
  buildingName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
