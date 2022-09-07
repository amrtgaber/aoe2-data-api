import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { VersionEntity } from './entities/version.entity';
import { VersionService } from './version.service';

@ApiTags('Versions')
@Controller('versions')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @ApiOkResponse({ type: [VersionEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getVersions(): Promise<VersionEntity> {
    const version = await this.versionService.getVersions();
    return new VersionEntity(version);
  }
}
