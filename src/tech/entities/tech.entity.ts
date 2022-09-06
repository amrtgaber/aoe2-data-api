import { Tech } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TechEntity implements Tech {
  @ApiProperty()
  id: number;

  @ApiProperty()
  techName: string;

  @ApiProperty()
  @Exclude()
  ageId: number;

  @ApiProperty()
  ages: [];

  @ApiProperty()
  civs: [];

  @ApiProperty()
  buildings: [];

  constructor(partial: Partial<TechEntity>) {
    Object.assign(this, partial);
  }
}
