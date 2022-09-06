/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { AgeService } from './age.service';
import { AgeController } from './age.controller';

@Module({
  controllers: [AgeController],
  providers: [AgeService],
})
export class AgeModule {}
