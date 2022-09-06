import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Age } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { AgeFindOptionsDto } from './dto/age-find-options.dto';
import { AgeService } from './age.service';

describe('AgeService', () => {
  let service: AgeService;
  let mockCtx: MockContext;

  const ageFindOptionsDto = new AgeFindOptionsDto();
  ageFindOptionsDto.includeUnits = false;
  ageFindOptionsDto.includeTechs = false;
  ageFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgeService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<AgeService>(AgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all ages', async () => {
      const testAge1: Age = {
        id: 1,
        ageName: 'dark age',
      };

      const testAge2: Age = {
        id: 2,
        ageName: 'feudal age',
      };

      mockCtx.prisma.age.findMany.mockResolvedValue([testAge1, testAge2]);

      expect(service.findAll(ageFindOptionsDto)).resolves.toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a age', async () => {
      const testAge: Age = {
        id: 1,
        ageName: 'dark age',
      };

      mockCtx.prisma.age.findUnique.mockResolvedValue(testAge);

      const age: Age | null = await service.findOneById(
        testAge.id,
        ageFindOptionsDto,
      );

      expect(age!.ageName).toBe('dark age');
    });
  });

  describe('findOneByName()', () => {
    it('should find a age', async () => {
      const testAge: Age = {
        id: 1,
        ageName: 'dark age',
      };

      mockCtx.prisma.age.findUnique.mockResolvedValue(testAge);

      const age: Age | null = await service.findOneByName(
        testAge.ageName,
        ageFindOptionsDto,
      );

      expect(age!.ageName).toBe('dark age');
    });
  });
});
