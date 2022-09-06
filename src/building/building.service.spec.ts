import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Building } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { BuildingFindOptionsDto } from './dto/building-find-options.dto';
import { BuildingService } from './building.service';

describe('BuildingService', () => {
  let service: BuildingService;
  let mockCtx: MockContext;

  const buildingFindOptionsDto = new BuildingFindOptionsDto();
  buildingFindOptionsDto.includeAge = false;
  buildingFindOptionsDto.includeCivs = false;
  buildingFindOptionsDto.includeUnits = false;
  buildingFindOptionsDto.includeTechs = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

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

      expect(service.findAll(buildingFindOptionsDto)).resolves.toHaveLength(2);
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

      const building: Building | null = await service.findOneById(
        testBuilding.id,
        buildingFindOptionsDto,
      );

      expect(building!.buildingName).toBe('house');
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

      const building: Building | null = await service.findOneByName(
        testBuilding.buildingName,
        buildingFindOptionsDto,
      );

      expect(building!.buildingName).toBe('house');
    });
  });
});
