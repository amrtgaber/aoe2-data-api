import { ApiProperty } from '@nestjs/swagger';
import { Building, Tech, Unit } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCivDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  civName: string;

  @ApiProperty()
  @IsNotEmpty()
  units: Unit[];

  @ApiProperty()
  @IsNotEmpty()
  techs: Tech[];

  @ApiProperty()
  @IsNotEmpty()
  buildings: Building[];
}
