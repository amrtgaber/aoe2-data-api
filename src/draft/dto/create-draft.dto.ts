import { ApiProperty } from '@nestjs/swagger';
import { Civ } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MIN_DRAFT_NAME_LENGTH } from '../../constants';

export class CreateDraftDto {
  @ApiProperty()
  @IsString()
  @MinLength(MIN_DRAFT_NAME_LENGTH)
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty()
  @IsBoolean()
  private: boolean;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  civs: Civ[];
}
