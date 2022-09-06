import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Tech } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { TechFindOptionsDto } from './dto/tech-find-options.dto';
import { TechService } from './tech.service';

describe('TechService', () => {
  let service: TechService;

  let mockCtx: MockContext;

  const techFindOptionsDto = new TechFindOptionsDto();
  techFindOptionsDto.includeAge = false;
  techFindOptionsDto.includeCivs = false;
  techFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<TechService>(TechService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all techs', async () => {
      const testTech1: Tech = {
        id: 1,
        techName: 'loom',
        ageId: 1,
      };

      const testTech2: Tech = {
        id: 2,
        techName: 'fletching',
        ageId: 1,
      };

      mockCtx.prisma.tech.findMany.mockResolvedValue([testTech1, testTech2]);

      expect(service.findAll(techFindOptionsDto)).resolves.toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a tech', async () => {
      const testTech: Tech = {
        id: 1,
        techName: 'loom',
        ageId: 1,
      };

      mockCtx.prisma.tech.findUnique.mockResolvedValue(testTech);

      const tech: Tech | null = await service.findOneById(
        testTech.id,
        techFindOptionsDto,
      );

      expect(tech!.techName).toBe('loom');
    });
  });

  describe('findOneByName()', () => {
    it('should find a tech', async () => {
      const testTech: Tech = {
        id: 1,
        techName: 'loom',
        ageId: 1,
      };

      mockCtx.prisma.tech.findUnique.mockResolvedValue(testTech);

      const tech: Tech | null = await service.findOneByName(
        testTech.techName,
        techFindOptionsDto,
      );

      expect(tech!.techName).toBe('loom');
    });
  });
});
