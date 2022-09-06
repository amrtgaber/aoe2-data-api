/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { CivModule } from './civ/civ.module';
import { BuildingModule } from './building/building.module';
import { UnitModule } from './unit/unit.module';
import { TechModule } from './tech/tech.module';
import { AgeModule } from './age/age.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CivModule,
    BuildingModule,
    UnitModule,
    TechModule,
    AgeModule,
  ],
})
export class AppModule {}
