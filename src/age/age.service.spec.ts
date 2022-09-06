import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Age } from '@prisma/client';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { AgeService } from './age.service';

describe('AgeService', () => {
  let service: AgeService;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgeService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<AgeService>(AgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all ages', async () => {
      const testAge1: Age = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ageName: 'archer',
      };

      const testAge2: Age = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ageName: 'skirmisher',
      };

      mockCtx.prisma.age.findMany.mockResolvedValue([testAge1, testAge2]);

      expect(service.findAll()).resolves.toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a age', async () => {
      const testAge: Age = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ageName: 'archer',
      };

      mockCtx.prisma.age.findUnique.mockResolvedValue(testAge);

      const age: Age | null = await service.findOneById(testAge.id);

      expect(age!.ageName).toBe('archer');
    });
  });
});
