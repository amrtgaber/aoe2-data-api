import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ConfigService, JwtService, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prismaService = module.get<PrismaService>(PrismaService);
    await prismaService.cleanDb();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should signup', async () => {
      const dto: AuthDto = {
        email: 'test@test.com',
        username: '',
        password: '111',
      };

      const token = await controller.signup(dto);

      expect(token).toHaveProperty('access_token');
      expect(token.access_token.length).toBeGreaterThan(0);
    });

    it('should throw if duplicate email', async () => {
      const dto: AuthDto = {
        email: 'test@test.com',
        username: '',
        password: '111',
      };

      await controller.signup(dto);

      await expect(controller.signup(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw if duplicate username', async () => {
      const dto: AuthDto = {
        email: 'test@test.com',
        username: 'abc',
        password: '111',
      };

      await controller.signup(dto);

      await expect(
        controller.signup({ ...dto, email: 'test2@test.com' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('login', () => {
    it('should login', async () => {
      const dto: AuthDto = {
        email: 'test@test.com',
        username: '',
        password: '111',
      };

      await controller.signup(dto);
      const token = await controller.login(dto);

      expect(token).toHaveProperty('access_token');
      expect(token.access_token.length).toBeGreaterThan(0);
    });

    it('should throw if password incorrect', async () => {
      const dto: AuthDto = {
        email: 'test@test.com',
        username: '',
        password: '111',
      };

      await controller.signup(dto);

      await expect(
        controller.login({ ...dto, password: '222' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
