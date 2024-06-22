import { ApiProperty } from '@nestjs/swagger';
import { Draft, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class DraftEntity implements Draft {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  private: boolean;

  @ApiProperty()
  owner: User;

  @Exclude()
  ownerId: number;

  @ApiProperty()
  civs: [];

  constructor(partial: Partial<DraftEntity>) {
    Object.assign(this, partial);
  }
}
