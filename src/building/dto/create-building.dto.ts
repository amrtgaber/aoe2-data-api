import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buildingName: string;
}
