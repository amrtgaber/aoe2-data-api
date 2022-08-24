/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';

@Module({
  controllers: [UnitController],
  providers: [UnitService],
})
export class UnitModule {}
