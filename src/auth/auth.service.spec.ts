import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon from 'argon2';
import { User } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  let mockCtx: MockContext;

  const testUser: User = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    email: 'test@test.com',
    username: '',
    hash: '111',
  };

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserByEmail()', () => {
    it('should throw if no user found', async () => {
      await expect(
        service.findUserByEmail('not@indatabase.com'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should return user', async () => {
      mockCtx.prisma.user.findUnique.mockResolvedValue(testUser);

      await expect(service.findUserByEmail(testUser.email)).resolves.toEqual(
        testUser,
      );
    });
  });

  describe('comparePassword()', () => {
    it('should throw if passwords dont match', async () => {
      const hash1 = await argon.hash('these are');

      await expect(
        service.comparePassword(hash1, 'not the same'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('signToken()', () => {
    it('should return access token', async () => {
      const token = await service.signToken(testUser.id, testUser.email);
      expect(token).toHaveProperty('access_token');
      expect(token.access_token.length).toBeGreaterThan(0);
    });
  });
});
