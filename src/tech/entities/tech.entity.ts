import { Tech } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TechEntity implements Tech {
  @ApiProperty()
  id: number;

  @ApiProperty()
  techName: string;

  @ApiProperty()
  ageId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
