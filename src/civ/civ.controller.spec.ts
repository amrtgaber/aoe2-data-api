import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Civ } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { CivController } from './civ.controller';
import { CivService } from './civ.service';
import { CivFindOptionsDto } from './dto/civ-find-options.dto';

describe('CivController', () => {
  let controller: CivController;
  let mockCtx: MockContext;

  const civFindOptionsDto = new CivFindOptionsDto();
  civFindOptionsDto.includeUnits = false;
  civFindOptionsDto.includeTechs = false;
  civFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CivController],
      providers: [
        CivService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<CivController>(CivController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const civs: Civ[] = await controller.findAll(civFindOptionsDto);

      expect(civs).toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a civ', async () => {
      const testCiv: Civ = {
        id: 1,
        civName: 'Aztecs',
      };

      mockCtx.prisma.civ.findUnique.mockResolvedValue(testCiv);

      const civ: Civ | null = await controller.findOneById(
        testCiv.id,
        civFindOptionsDto,
      );

      expect(civ!.civName).toBe('Aztecs');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById(0, civFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneByName()', () => {
    it('should find a civ', async () => {
      const testCiv: Civ = {
        id: 1,
        civName: 'Aztecs',
      };

      mockCtx.prisma.civ.findUnique.mockResolvedValue(testCiv);

      const civ: Civ | null = await controller.findOneByName(
        testCiv.civName,
        civFindOptionsDto,
      );

      expect(civ!.civName).toBe('Aztecs');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneByName('', civFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
