import { Test, TestingModule } from '@nestjs/testing';
import { Age } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { AgeController } from './age.controller';
import { AgeService } from './age.service';

describe('AgeController', () => {
  let controller: AgeController;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgeController],
      providers: [
        AgeService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<AgeController>(AgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      const ages: Age[] = await controller.findAll();

      expect(ages).toHaveLength(2);
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

      const age: Age | null = await controller.findOneById(
        testAge.id.toString(),
      );

      expect(age!.ageName).toBe('archer');
    });

    it('should return not found', async () => {
      mockCtx.prisma.age.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById('');
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
