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

  describe('cleanDb()', () => {
    it('should clean the database', async () => {
      try {
        await service.user.create({
          data: {
            email: 'test@test.com',
            hash: '111',
          },
        });
      } catch {} // ignore unique constraint failure

      try {
        await service.civ.create({
          data: {
            civName: 'Aztecs',
          },
        });
      } catch {} // ignore unique constraint failure

      expect(await service.user.findMany()).toHaveLength(1);
      expect(await service.civ.findMany()).toHaveLength(1);

      await service.cleanDb();

      expect(await service.user.findMany()).toHaveLength(0);
      expect(await service.civ.findMany()).toHaveLength(0);
    });
  });
});
