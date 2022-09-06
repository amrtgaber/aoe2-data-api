import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Civ } from '@prisma/client';

import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { CivController } from './civ.controller';
import { CivService } from './civ.service';

describe('CivController', () => {
  let controller: CivController;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

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
        createdAt: new Date(),
        updatedAt: new Date(),
        civName: 'Aztecs',
      };

      const testCiv2: Civ = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        civName: 'Vikings',
      };

      mockCtx.prisma.civ.findMany.mockResolvedValue([testCiv1, testCiv2]);

      const civs: Civ[] = await controller.findAll();

      expect(civs).toHaveLength(2);
    });
  });

  describe('findOneByID()', () => {
    it('should find a civ', async () => {
      const testCiv: Civ = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        civName: 'Aztecs',
      };

      mockCtx.prisma.civ.findUnique.mockResolvedValue(testCiv);

      const civ: Civ | null = await controller.findOneById(
        testCiv.id.toString(),
      );

      expect(civ!.civName).toBe('Aztecs');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById('');
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
