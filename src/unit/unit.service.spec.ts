import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Unit } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { UnitFindOptionsDto } from './dto/unit-find-options.dto';
import { UnitService } from './unit.service';

describe('UnitService', () => {
  let service: UnitService;

  let mockCtx: MockContext;

  const unitFindOptionsDto = new UnitFindOptionsDto();
  unitFindOptionsDto.includeAge = false;
  unitFindOptionsDto.includeCivs = false;
  unitFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<UnitService>(UnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all units', async () => {
      const testUnit1: Unit = {
        id: 1,
        unitName: 'archer',
        ageId: 1,
      };

      const testUnit2: Unit = {
        id: 2,
        unitName: 'skirmisher',
        ageId: 1,
      };

      mockCtx.prisma.unit.findMany.mockResolvedValue([testUnit1, testUnit2]);

      expect(service.findAll(unitFindOptionsDto)).resolves.toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a unit', async () => {
      const testUnit: Unit = {
        id: 1,
        unitName: 'archer',
        ageId: 1,
      };

      mockCtx.prisma.unit.findUnique.mockResolvedValue(testUnit);

      const unit: Unit | null = await service.findOneById(
        testUnit.id,
        unitFindOptionsDto,
      );

      expect(unit!.unitName).toBe('archer');
    });
  });

  describe('findOneByName()', () => {
    it('should find a unit', async () => {
      const testUnit: Unit = {
        id: 1,
        unitName: 'archer',
        ageId: 1,
      };

      mockCtx.prisma.unit.findUnique.mockResolvedValue(testUnit);

      const unit: Unit | null = await service.findOneByName(
        testUnit.unitName,
        unitFindOptionsDto,
      );

      expect(unit!.unitName).toBe('archer');
    });
  });
});
