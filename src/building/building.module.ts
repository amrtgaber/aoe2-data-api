/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';

@Module({
  controllers: [BuildingController],
  providers: [BuildingService],
})
export class BuildingModule {}
