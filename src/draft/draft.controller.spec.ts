import { Test, TestingModule } from '@nestjs/testing';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';

describe('DraftController', () => {
  let controller: DraftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DraftController],
      providers: [DraftService],
    }).compile();

    controller = module.get<DraftController>(DraftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
