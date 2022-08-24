/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CivModule } from './civ/civ.module';
import { UnitModule } from './unit/unit.module';
import { TechModule } from './tech/tech.module';
import { BuildingModule } from './building/building.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    CivModule,
    UnitModule,
    TechModule,
    BuildingModule,
  ],
})
export class AppModule {}
