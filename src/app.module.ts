/* istanbul ignore file */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AgeModule } from './age/age.module';
import { AuthModule } from './auth/auth.module';
import { BuildingModule } from './building/building.module';
import { CivModule } from './civ/civ.module';
import { DraftModule } from './draft/draft.module';
import { LikeModule } from './like/like.module';
import { PrismaModule } from './prisma/prisma.module';
import { TechModule } from './tech/tech.module';
import { UnitModule } from './unit/unit.module';
import { UserModule } from './user/user.module';
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
    DraftModule,
    UserModule,
    LikeModule,
  ],
})
export class AppModule {}
