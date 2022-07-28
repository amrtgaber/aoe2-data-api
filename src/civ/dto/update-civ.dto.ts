import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateCivDto } from './create-civ.dto';

export class UpdateCivDto extends PartialType(CreateCivDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  civName?: string;
}
