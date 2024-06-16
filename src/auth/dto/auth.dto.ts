import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../../constants';
import { IsUsername } from '../validators/is-username';

export class AuthDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(MIN_USERNAME_LENGTH)
  @IsUsername()
  username: string | null;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  password: string;
}
