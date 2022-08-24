import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Unit } from '@prisma/client';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

describe('UnitService', () => {
  let service: UnitService;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

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

  describe('create()', () => {
    it('should create a unit', async () => {
      const createUnitDto: CreateUnitDto = {
        unitName: 'archer',
      };

      const testUnit: Unit = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitName: 'archer',
      };

      mockCtx.prisma.unit.create.mockResolvedValue(testUnit);

      const unit: Unit = await service.create(createUnitDto);

      expect(unit.unitName).toBe('archer');
    });
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

      expect(service.findAll()).resolves.toHaveLength(2);
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

      const unit: Unit | null = await service.findOne(testUnit.id);

      expect(unit!.unitName).toBe('archer');
    });
  });

  describe('update()', () => {
    it('should update a unit', async () => {
      const testUnit: Unit = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitName: 'archer',
      };

      const updateDto: UpdateUnitDto = {
        unitName: 'ignored in this test due to mock',
      };

      mockCtx.prisma.unit.update.mockResolvedValue(testUnit);

      const unit: Unit = await service.update(testUnit.id, updateDto);

      expect(unit.unitName).toBe('archer');
    });
  });

  describe('remove()', () => {
    it('should remove a unit', async () => {
      const testUnit: Unit = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        unitName: 'archer',
      };

      mockCtx.prisma.unit.delete;

      await service.remove(testUnit.id);

      expect(mockCtx.prisma.unit.delete).toHaveBeenCalled();
    });
  });
});
