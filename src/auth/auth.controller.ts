import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService, JwtAccessToken } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ type: JwtAccessToken })
  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<JwtAccessToken> {
    return this.authService.signup(dto);
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: JwtAccessToken })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto): Promise<JwtAccessToken> {
    return this.authService.login(dto);
  }
}