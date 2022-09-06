import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Civ } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { CivFindOptionsDto } from './dto/civ-find-options.dto';
import { CivService } from './civ.service';

describe('CivService', () => {
  let service: CivService;
  let mockCtx: MockContext;

  const civFindOptionsDto = new CivFindOptionsDto();
  civFindOptionsDto.includeUnits = false;
  civFindOptionsDto.includeTechs = false;
  civFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CivService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<CivService>(CivService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all civs', async () => {
      const testCiv1: Civ = {
        id: 1,
        civName: 'Aztecs',
      };

      const testCiv2: Civ = {
        id: 2,
        civName: 'Vikings',
      };

      mockCtx.prisma.civ.findMany.mockResolvedValue([testCiv1, testCiv2]);

      expect(service.findAll(civFindOptionsDto)).resolves.toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a civ', async () => {
      const testCiv: Civ = {
        id: 1,
        civName: 'Aztecs',
      };

      mockCtx.prisma.civ.findUnique.mockResolvedValue(testCiv);

      const civ: Civ | null = await service.findOneById(
        testCiv.id,
        civFindOptionsDto,
      );

      expect(civ!.civName).toBe('Aztecs');
    });
  });

  describe('findOneByName()', () => {
    it('should find a civ', async () => {
      const testCiv: Civ = {
        id: 1,
        civName: 'Aztecs',
      };

      mockCtx.prisma.civ.findUnique.mockResolvedValue(testCiv);

      const civ: Civ | null = await service.findOneByName(
        testCiv.civName,
        civFindOptionsDto,
      );

      expect(civ!.civName).toBe('Aztecs');
    });
  });
});
