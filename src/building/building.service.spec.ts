import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Building } from '@prisma/client';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { BuildingService } from './building.service';

describe('BuildingService', () => {
  let service: BuildingService;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<BuildingService>(BuildingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all buildings', async () => {
      const testBuilding1: Building = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        buildingName: 'archer',
      };

      const testBuilding2: Building = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        buildingName: 'skirmisher',
      };

      mockCtx.prisma.building.findMany.mockResolvedValue([
        testBuilding1,
        testBuilding2,
      ]);

      expect(service.findAll()).resolves.toHaveLength(2);
    });
  });

  describe('findOne()', () => {
    it('should find a building', async () => {
      const testBuilding: Building = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        buildingName: 'archer',
      };

      mockCtx.prisma.building.findUnique.mockResolvedValue(testBuilding);

      const building: Building | null = await service.findOne(testBuilding.id);

      expect(building!.buildingName).toBe('archer');
    });
  });
});
