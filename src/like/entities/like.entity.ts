import { ApiProperty } from '@nestjs/swagger';
import { Like } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class LikeEntity implements Like {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  userId: number;

  @Exclude()
  draftId: number;

  constructor(partial: Partial<LikeEntity>) {
    Object.assign(this, partial);
  }
}
