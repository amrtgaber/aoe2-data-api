import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateTechDto } from './create-tech.dto';

export class UpdateTechDto extends PartialType(CreateTechDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  techName?: string;
}
