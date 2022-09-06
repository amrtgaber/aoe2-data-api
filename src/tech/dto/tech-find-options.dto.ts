import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class TechFindOptionsDto {
  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeAge?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeCivs?: boolean;

  @ApiProperty({ default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeBuildings?: boolean;
}
