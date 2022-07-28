import { Civ } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CivEntity implements Civ {
  @ApiProperty()
  id: number;

  @ApiProperty()
  civName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
