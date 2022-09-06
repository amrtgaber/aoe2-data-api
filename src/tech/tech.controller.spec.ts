import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Tech } from '@prisma/client';

import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { TechController } from './tech.controller';
import { TechService } from './tech.service';
import { TechFindOptionsDto } from './dto/tech-find-options.dto';

describe('TechController', () => {
  let controller: TechController;

  let mockCtx: MockContext;

  const techFindOptionsDto = new TechFindOptionsDto();
  techFindOptionsDto.includeAge = false;
  techFindOptionsDto.includeCivs = false;
  techFindOptionsDto.includeBuildings = false;

  beforeEach(async () => {
    mockCtx = createMockContext();

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

  describe('findAll()', () => {
    it('should find all techs', async () => {
      const testTech1: Tech = {
        id: 1,
        techName: 'loom',
        ageId: 1,
      };

      const testTech2: Tech = {
        id: 1,
        techName: 'fletching',
        ageId: 1,
      };

      mockCtx.prisma.tech.findMany.mockResolvedValue([testTech1, testTech2]);

      const techs: Tech[] = await controller.findAll(techFindOptionsDto);

      expect(techs).toHaveLength(2);
    });
  });

  describe('findOneById()', () => {
    it('should find a tech', async () => {
      const testTech: Tech = {
        id: 1,
        techName: 'loom',
        ageId: 1,
      };

      mockCtx.prisma.tech.findUnique.mockResolvedValue(testTech);

      const tech: Tech | null = await controller.findOneById(
        testTech.id,
        techFindOptionsDto,
      );

      expect(tech!.techName).toBe('loom');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneById(0, techFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findOneByName()', () => {
    it('should find a tech', async () => {
      const testTech: Tech = {
        id: 1,
        techName: 'loom',
        ageId: 1,
      };

      mockCtx.prisma.tech.findUnique.mockResolvedValue(testTech);

      const tech: Tech | null = await controller.findOneByName(
        testTech.techName,
        techFindOptionsDto,
      );

      expect(tech!.techName).toBe('loom');
    });

    it('should return not found', async () => {
      mockCtx.prisma.unit.findUnique.mockResolvedValue(null);
      expect(async () => {
        await controller.findOneByName('', techFindOptionsDto);
      }).rejects.toThrowError(NotFoundException);
    });
  });
});
