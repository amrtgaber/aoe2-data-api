import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService, JwtTokens } from './auth.service';
import { GetUser } from './decorator/get-user.decorator';
import { AuthDto } from './dto/auth.dto';
import { AccessGuard } from './guard/access.guard';
import { RefreshGuard } from './guard/refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ type: JwtTokens })
  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<JwtTokens> {
    return this.authService.signup(dto);
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: JwtTokens })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto): Promise<JwtTokens> {
    return this.authService.login(dto);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AccessGuard)
  @Post('logout')
  async logout(@GetUser('id') userId: number) {
    await this.authService.logout(userId);
  }

  @ApiOkResponse({ status: HttpStatus.OK, type: JwtTokens })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@GetUser() user: User & { sub: number }) {
    if (!user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    return this.authService.refresh(user.sub, user.refreshToken);
  }
}
