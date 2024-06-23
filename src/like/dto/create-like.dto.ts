import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  draftId: number;
}
