import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ConfigService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deleteUsers()', () => {
    it('should clean the database', async () => {
      await service.user.upsert({
        where: {
          id: 1,
        },
        update: {},
        create: {
          id: 1,
          email: 'test@test.com',
          hash: '',
        },
      });

      expect(await service.user.findMany()).toHaveLength(1);

      await service.deleteUsers();

      expect(await service.user.findMany()).toHaveLength(0);
    });
  });
});
