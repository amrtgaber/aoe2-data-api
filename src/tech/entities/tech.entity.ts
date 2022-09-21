import { Age, Tech } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TechEntity implements Tech {
  @ApiProperty()
  id: number;

  @ApiProperty()
  techName: string;

  @Exclude()
  ageId: number;

  @ApiProperty()
  age: Age;

  @ApiProperty()
  civs: [];

  @ApiProperty()
  buildings: [];

  constructor(partial: Partial<TechEntity>) {
    Object.assign(this, partial);
  }
}
