import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Tech } from '@prisma/client';
import {
  Context,
  createMockContext,
  MockContext,
} from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { TechService } from './tech.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';

describe('TechService', () => {
  let service: TechService;

  let mockCtx: MockContext;
  let ctx: Context;

  beforeEach(async () => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<TechService>(TechService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a tech', async () => {
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

      const tech: Tech = await service.create(createTechDto);

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

      expect(service.findAll()).resolves.toHaveLength(2);
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

      const tech: Tech | null = await service.findOne(testTech.id);

      expect(tech!.techName).toBe('archer');
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

      const updateDto: UpdateTechDto = {
        techName: 'ignored in this test due to mock',
      };

      mockCtx.prisma.tech.update.mockResolvedValue(testTech);

      const tech: Tech = await service.update(testTech.id, updateDto);

      expect(tech.techName).toBe('archer');
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

      await service.remove(testTech.id);

      expect(mockCtx.prisma.tech.delete).toHaveBeenCalled();
    });
  });
});
