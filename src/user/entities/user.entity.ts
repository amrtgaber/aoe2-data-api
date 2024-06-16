import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsOptional()
  username: string;

  @Exclude()
  hash: string;

  @ApiProperty()
  drafts: [];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
