import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBuildingDto } from './create-building.dto';

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  buildingName?: string;
}
