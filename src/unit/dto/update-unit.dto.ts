import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUnitDto } from './create-unit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  unitName?: string;
}
