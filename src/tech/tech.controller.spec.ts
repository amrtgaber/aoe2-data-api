import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Tech } from '@prisma/client';

import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { TechController } from './tech.controller';
import { TechService } from './tech.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

describe('TechController', () => {
  let controller: TechController;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechController],
      providers: [
        TechService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<TechController>(TechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create', async () => {
      const createTechDto: CreateTechDto = {
        techName: 'archer',
      };

      const testTech: Tech = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        techName: 'archer',
      };

      mockCtx.prisma.tech.create.mockResolvedValue(testTech);

      const tech: Tech = await controller.create(createTechDto);

      expect(tech.techName).toBe('archer');
    });
  });

  describe('findAll()', () => {
    it('should find all techs', async () => {
      const testTech1: Tech = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        techName: 'archer',
      };

      const testTech2: Tech = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        techName: 'skirmisher',
      };

      mockCtx.prisma.tech.findMany.mockResolvedValue([testTech1, testTech2]);

      const techs: Tech[] = await controller.findAll();

      expect(techs).toHaveLength(2);
    });
  });

  describe('findOne()', () => {
    it('should find a tech', async () => {
      const testTech: Tech = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        techName: 'archer',
      };

      mockCtx.prisma.tech.findUnique.mockResolvedValue(testTech);

      const tech: Tech | null = await controller.findOne(
        testTech.id.toString(),
      );

      expect(tech!.techName).toBe('archer');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOne('');
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update a tech', async () => {
      const testTech: Tech = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        techName: 'archer',
      };

      const updateTechDto: UpdateTechDto = {
        techName: 'ignored in this test due to mock',
      };

      mockCtx.prisma.tech.update.mockResolvedValue(testTech);

      const tech: Tech = await controller.update(
        testTech.id.toString(),
        updateTechDto,
      );

      expect(tech!.techName).toBe('archer');
    });
  });

  describe('remove()', () => {
    it('should remove a tech', async () => {
      const testTech: Tech = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        techName: 'archer',
      };

      mockCtx.prisma.tech.delete;

      await controller.remove(testTech.id.toString());

      expect(mockCtx.prisma.tech.delete).toHaveBeenCalled();
    });
  });
});
