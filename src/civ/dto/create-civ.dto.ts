import { ApiProperty } from '@nestjs/swagger';
import { Building, Tech, Unit } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCivDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  civName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  units?: Unit[];

  @ApiProperty({ required: false })
  @IsOptional()
  techs?: Tech[];

  @ApiProperty({ required: false })
  @IsOptional()
  buildings?: Building[];
}
