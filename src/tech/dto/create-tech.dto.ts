import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTechDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  techName: string;
}
