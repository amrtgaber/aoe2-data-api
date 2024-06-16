import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { IsUsername } from '../../auth/validators/is-username';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../../constants';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(MIN_USERNAME_LENGTH)
  @IsUsername()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  password: string;
}
