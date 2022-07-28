/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { CivService } from './civ.service';
import { CivController } from './civ.controller';

@Module({
  controllers: [CivController],
  providers: [CivService],
})
export class CivModule {}
