import { Unit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UnitEntity implements Unit {
  @ApiProperty()
  id: number;

  @ApiProperty()
  unitName: string;

  @ApiProperty()
  ageId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
