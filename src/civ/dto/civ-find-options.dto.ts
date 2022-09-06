import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CivFindOptionsDto {
  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeUnits?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeTechs?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeBuildings?: boolean;
}
