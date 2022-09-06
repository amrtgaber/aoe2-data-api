import { Test, TestingModule } from '@nestjs/testing';
import { Building } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { BuildingFindOptionsDto } from './dto/building-find-options.dto';

describe('BuildingController', () => {
  let controller: BuildingController;
  let mockCtx: MockContext;

  const buildingFindOptionsDto = new BuildingFindOptionsDto();
  buildingFindOptionsDto.includeAge = false;
  buildingFindOptionsDto.includeCivs = false;
  buildingFindOptionsDto.includeUnits = false;
  buildingFindOptionsDto.includeTechs = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

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

  describe('findAll()', () => {
    it('should find all buildings', async () => {
      const testBuilding1: Building = {
        id: 1,
        buildingName: 'house',
        ageId: 1,
      };

      const testBuilding2: Building = {
        id: 2,
        buildingName: 'mill',
        ageId: 1,
      };

      mockCtx.prisma.building.findMany.mockResolvedValue([
        testBuilding1,
        testBuilding2,
      ]);

      const buildings: Building[] = await controller.findAll(
        buildingFindOptionsDto,
      );

      expect(buildings).toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a building', async () => {
      const testBuilding: Building = {
        id: 1,
        buildingName: 'house',
        ageId: 1,
      };

      mockCtx.prisma.building.findUnique.mockResolvedValue(testBuilding);

      const building: Building | null = await controller.findOneById(
        testBuilding.id,
        buildingFindOptionsDto,
      );

      expect(building!.buildingName).toBe('house');
    });

    it('should return not found', async () => {
      mockCtx.prisma.building.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById(0, buildingFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneByName()', () => {
    it('should find a building', async () => {
      const testBuilding: Building = {
        id: 1,
        buildingName: 'house',
        ageId: 1,
      };

      mockCtx.prisma.building.findUnique.mockResolvedValue(testBuilding);

      const building: Building | null = await controller.findOneByName(
        testBuilding.buildingName,
        buildingFindOptionsDto,
      );

      expect(building!.buildingName).toBe('house');
    });

    it('should return not found', async () => {
      mockCtx.prisma.building.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneByName('', buildingFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
