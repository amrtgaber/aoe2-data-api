import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Version } from '@prisma/client';

import { VERSION_ID } from '../../prisma/seed';
import { createMockContext, MockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { VersionService } from './version.service';

describe('VersionService', () => {
  let service: VersionService;

  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersionService,
        { provide: PrismaService, useValue: mockCtx.prisma },
        ConfigService,
      ],
    }).compile();

    service = module.get<VersionService>(VersionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const versions = await service.getVersions();

      expect(versions.gameVersion).toBe('100');
    });
  });
});
