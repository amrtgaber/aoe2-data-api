import { Test, TestingModule } from '@nestjs/testing';
import { Building } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

describe('BuildingController', () => {
  let controller: BuildingController;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingController],
      providers: [
        BuildingService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<BuildingController>(BuildingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create', async () => {
      const createBuildingDto: CreateBuildingDto = {
        buildingName: 'archer',
      };

      const testBuilding: Building = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        buildingName: 'archer',
      };

      mockCtx.prisma.building.create.mockResolvedValue(testBuilding);

      const building: Building = await controller.create(createBuildingDto);

      expect(building.buildingName).toBe('archer');
    });
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

      const buildings: Building[] = await controller.findAll();

      expect(buildings).toHaveLength(2);
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

      const building: Building | null = await controller.findOne(
        testBuilding.id.toString(),
      );

      expect(building!.buildingName).toBe('archer');
    });

    it('should return not found', async () => {
      mockCtx.prisma.building.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOne('');
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update a building', async () => {
      const testBuilding: Building = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        buildingName: 'archer',
      };

      const updateBuildingDto: UpdateBuildingDto = {
        buildingName: 'ignored in this test due to mock',
      };

      mockCtx.prisma.building.update.mockResolvedValue(testBuilding);

      const building: Building = await controller.update(
        testBuilding.id.toString(),
        updateBuildingDto,
      );

      expect(building!.buildingName).toBe('archer');
    });
  });

  describe('remove()', () => {
    it('should remove a building', async () => {
      const testBuilding: Building = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        buildingName: 'archer',
      };

      mockCtx.prisma.building.delete;

      await controller.remove(testBuilding.id.toString());

      expect(mockCtx.prisma.building.delete).toHaveBeenCalled();
    });
  });
});
