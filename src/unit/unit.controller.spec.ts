import { Test, TestingModule } from '@nestjs/testing';
import { Unit } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { UnitFindOptionsDto } from './dto/unit-find-options.dto';

describe('UnitController', () => {
  let controller: UnitController;

  let mockCtx: MockContext;

  const unitFindOptionsDto = new UnitFindOptionsDto();
  unitFindOptionsDto.includeAge = false;
  unitFindOptionsDto.includeCivs = false;
  unitFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitController],
      providers: [
        UnitService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<UnitController>(UnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const units: Unit[] = await controller.findAll(unitFindOptionsDto);

      expect(units).toHaveLength(2);
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

      const unit: Unit | null = await controller.findOneById(
        testUnit.id,
        unitFindOptionsDto,
      );

      expect(unit!.unitName).toBe('archer');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById(0, unitFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
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

      const unit: Unit | null = await controller.findOneByName(
        testUnit.unitName,
        unitFindOptionsDto,
      );

      expect(unit!.unitName).toBe('archer');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneByName('', unitFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
