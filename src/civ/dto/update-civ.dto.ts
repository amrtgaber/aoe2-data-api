import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Building, Tech, Unit } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { CreateCivDto } from './create-civ.dto';

export class UpdateCivDto extends PartialType(CreateCivDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  civName?: string;

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
