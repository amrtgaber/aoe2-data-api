import { Test, TestingModule } from '@nestjs/testing';
import { Age } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { AgeController } from './age.controller';
import { AgeService } from './age.service';
import { AgeFindOptionsDto } from './dto/age-find-options.dto';

describe('AgeController', () => {
  let controller: AgeController;
  let mockCtx: MockContext;

  const ageFindOptionsDto = new AgeFindOptionsDto();
  ageFindOptionsDto.includeUnits = false;
  ageFindOptionsDto.includeTechs = false;
  ageFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

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
        ageName: 'dark age',
      };

      const testAge2: Age = {
        id: 2,
        ageName: 'feudal age',
      };

      mockCtx.prisma.age.findMany.mockResolvedValue([testAge1, testAge2]);

      const ages: Age[] = await controller.findAll(ageFindOptionsDto);

      expect(ages).toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a age', async () => {
      const testAge: Age = {
        id: 1,
        ageName: 'dark age',
      };

      mockCtx.prisma.age.findUnique.mockResolvedValue(testAge);

      const age: Age | null = await controller.findOneById(
        testAge.id,
        ageFindOptionsDto,
      );

      expect(age!.ageName).toBe('dark age');
    });

    it('should return not found', async () => {
      mockCtx.prisma.age.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById(0, ageFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneByName()', () => {
    it('should find a age', async () => {
      const testAge: Age = {
        id: 1,
        ageName: 'dark age',
      };

      mockCtx.prisma.age.findUnique.mockResolvedValue(testAge);

      const age: Age | null = await controller.findOneByName(
        testAge.ageName,
        ageFindOptionsDto,
      );

      expect(age!.ageName).toBe('dark age');
    });

    it('should return not found', async () => {
      mockCtx.prisma.age.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneByName('', ageFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
