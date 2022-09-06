import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Civ } from '@prisma/client';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { CivService } from './civ.service';

describe('CivService', () => {
  let service: CivService;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CivService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<CivService>(CivService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      expect(service.findAll()).resolves.toHaveLength(2);
    });
  });

  describe('findOne()', () => {
    it('should find a civ', async () => {
      const testCiv: Civ = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        civName: 'Aztecs',
      };

      mockCtx.prisma.civ.findUnique.mockResolvedValue(testCiv);

      const civ: Civ | null = await service.findOne(testCiv.id);

      expect(civ!.civName).toBe('Aztecs');
    });
  });
});
