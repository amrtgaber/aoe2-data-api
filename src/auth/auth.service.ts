import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

export class JwtAccessToken {
  @ApiProperty()
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async login(dto: AuthDto): Promise<JwtAccessToken> {
    const user = await this.findUserByEmail(dto.email);
    await this.comparePassword(user.hash, dto.password);
    return await this.signToken(user.id, user.email);
  }

  async findUserByEmail(email: string): Promise<User> {
    let user: User | null;
    user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credentials Email Incorrect');
    }

    return user;
  }

  async comparePassword(hash: string, password: string) {
    const isCorrectPassword = await argon.verify(hash, password);

    if (!isCorrectPassword) {
      throw new ForbiddenException('Credentials Password Incorrect');
    }
  }

  async signToken(userId: number, email: string): Promise<JwtAccessToken> {
    const payload: object = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
