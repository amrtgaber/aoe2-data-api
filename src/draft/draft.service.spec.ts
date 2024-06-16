import { Test, TestingModule } from '@nestjs/testing';
import { DraftService } from './draft.service';

describe('DraftService', () => {
  let service: DraftService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DraftService],
    }).compile();

    service = module.get<DraftService>(DraftService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
