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
        await service.age.create({
          data: {
            id: 1,
            ageName: 'dark age',
          },
        });
      } catch {} // ignore unique constraint failure

      try {
        await service.unit.create({
          data: {
            unitName: 'villager',
            ageId: 1,
          },
        });
      } catch {} // ignore unique constraint failure

      try {
        await service.tech.create({
          data: {
            techName: 'loom',
            ageId: 1,
          },
        });
      } catch {} // ignore unique constraint failure

      try {
        await service.building.create({
          data: {
            buildingName: 'house',
            ageId: 1,
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

      expect(await service.age.findMany()).toHaveLength(1);
      expect(await service.unit.findMany()).toHaveLength(1);
      expect(await service.tech.findMany()).toHaveLength(1);
      expect(await service.building.findMany()).toHaveLength(1);
      expect(await service.civ.findMany()).toHaveLength(1);

      await service.cleanDb();

      expect(await service.age.findMany()).toHaveLength(0);
      expect(await service.unit.findMany()).toHaveLength(0);
      expect(await service.tech.findMany()).toHaveLength(0);
      expect(await service.building.findMany()).toHaveLength(0);
      expect(await service.civ.findMany()).toHaveLength(0);
    });
  });
});
