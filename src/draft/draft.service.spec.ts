import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { DraftService } from './draft.service';

describe('DraftService', () => {
  let service: DraftService;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DraftService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    service = module.get<DraftService>(DraftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
