import { Test, TestingModule } from '@nestjs/testing';
import { Version } from '@prisma/client';

import { VERSION_ID } from '../../prisma/seed';
import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

describe('VersionController', () => {
  let controller: VersionController;

  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [
        VersionService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<VersionController>(VersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find all versions', async () => {
      const testVersion: Version = {
        id: VERSION_ID,
        gameVersion: '100',
        apiVersion: '200',
        createdAt: new Date(),
      };

      mockCtx.prisma.version.findUnique.mockResolvedValue(testVersion);

      const versions: Version = await controller.getVersions();

      expect(versions.gameVersion).toBe('100');
    });
  });
});
