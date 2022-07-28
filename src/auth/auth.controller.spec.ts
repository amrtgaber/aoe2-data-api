import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return user', async () => {
      const testUser: User = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'test@test.com',
        hash: await argon.hash('111'),
      };

      mockCtx.prisma.user.findUnique.mockResolvedValue(testUser);

      const dto: AuthDto = { email: testUser.email, password: '111' };

      const token = await controller.login(dto);

      expect(token).toHaveProperty('access_token');
      expect(token.access_token.length).toBeGreaterThan(0);
    });
  });
});
