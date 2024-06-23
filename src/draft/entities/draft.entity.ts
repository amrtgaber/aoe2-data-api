import { ApiProperty } from '@nestjs/swagger';
import { Draft, Like, User } from '@prisma/client';
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
  gameVersion: string;

  @ApiProperty()
  owner: User;

  @ApiProperty()
  ownerId: number;

  @ApiProperty()
  civs: [];

  @Exclude()
  likes: Like[];

  @ApiProperty()
  _count: { likes: number };

  constructor(partial: Partial<DraftEntity>) {
    Object.assign(this, partial);
  }
}
