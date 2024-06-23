import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../test/prisma.mock-context';
import { PrismaService } from '../prisma/prisma.service';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';

describe('DraftController', () => {
  let controller: DraftController;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DraftController],
      providers: [
        DraftService,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    controller = module.get<DraftController>(DraftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
