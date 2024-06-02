import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, JwtAccessToken } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ type: JwtAccessToken })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<JwtAccessToken> {
    return this.authService.signup(dto);
  }

  @ApiCreatedResponse({ type: JwtAccessToken })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto): Promise<JwtAccessToken> {
    return this.authService.login(dto);
  }
}
