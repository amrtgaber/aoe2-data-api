import { Module } from '@nestjs/common';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';

@Module({
  controllers: [DraftController],
  providers: [DraftService],
})
export class DraftModule {}
