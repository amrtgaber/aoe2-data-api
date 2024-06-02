/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CivModule } from './civ/civ.module';
import { BuildingModule } from './building/building.module';
import { UnitModule } from './unit/unit.module';
import { TechModule } from './tech/tech.module';
import { AgeModule } from './age/age.module';
import { VersionModule } from './version/version.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    CivModule,
    BuildingModule,
    UnitModule,
    TechModule,
    AgeModule,
    VersionModule,
  ],
})
export class AppModule {}
