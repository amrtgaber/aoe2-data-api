import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let service: LikeService;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
