import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

export class JwtTokens {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto): Promise<JwtTokens> {
    const hash = await argon.hash(dto.password);

    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // duplicate email or username
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email or username already exists');
        }
      }
    }

    return await this.signTokens(user.id, user.email);
  }

  async login(dto: AuthDto): Promise<JwtTokens> {
    const user = await this.findUserByEmail(dto.email);
    await this.compareHash(user.hash, dto.password);
    return await this.signTokens(user.id, user.email);
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    await this.compareHash(user.refreshToken, refreshToken);
    return await this.signTokens(user.id, user.email);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials Email Incorrect');
    }

    return user;
  }

  async compareHash(hash: string, plainText: string) {
    const isCorrectPassword = await argon.verify(hash, plainText);

    if (!isCorrectPassword) {
      throw new ForbiddenException('Credentials Password Incorrect');
    }
  }

  async signTokens(userId: number, email: string): Promise<JwtTokens> {
    const payload = {
      sub: userId,
      email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret:
          this.config.get('ACCESS_TOKEN_SECRET') ||
          process.env.ACCESS_TOKEN_SECRET,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: '30d',
        secret:
          this.config.get('REFRESH_TOKEN_SECRET') ||
          process.env.REFRESH_TOKEN_SECRET,
      }),
    ]);

    await this.updateRefreshToken(userId, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await argon.hash(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }
}
