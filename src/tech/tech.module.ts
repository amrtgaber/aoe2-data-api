/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { TechService } from './tech.service';
import { TechController } from './tech.controller';

@Module({
  controllers: [TechController],
  providers: [TechService],
})
export class TechModule {}
