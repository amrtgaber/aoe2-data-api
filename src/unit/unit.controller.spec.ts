import { Test, TestingModule } from '@nestjs/testing';
import { Unit } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

describe('UnitController', () => {
  let controller: UnitController;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

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
        createdAt: new Date(),
        updatedAt: new Date(),
        unitName: 'archer',
      };

      const testUnit2: Unit = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitName: 'skirmisher',
      };

      mockCtx.prisma.unit.findMany.mockResolvedValue([testUnit1, testUnit2]);

      const units: Unit[] = await controller.findAll();

      expect(units).toHaveLength(2);
    });
  });

  describe('findOne()', () => {
    it('should find a unit', async () => {
      const testUnit: Unit = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitName: 'archer',
      };

      mockCtx.prisma.unit.findUnique.mockResolvedValue(testUnit);

      const unit: Unit | null = await controller.findOne(
        testUnit.id.toString(),
      );

      expect(unit!.unitName).toBe('archer');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOne('');
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
