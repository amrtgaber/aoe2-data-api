/* istanbul ignore file */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        config.get('REFRESH_TOKEN_SECRET') || process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const authHeader = req.get('authorization');

    if (!authHeader) {
      throw new ForbiddenException('Authorization header does not exist');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();

    return {
      ...payload,
      refreshToken,
    };
  }
}
