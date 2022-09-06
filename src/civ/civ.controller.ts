import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CivEntity } from './entities/civ.entity';
import { CivService } from './civ.service';
import { CivFindOptionsDto } from './dto/civ-find-options.dto';

@ApiTags('Civs')
@Controller('civs')
export class CivController {
  constructor(private readonly civService: CivService) {}

  @ApiOkResponse({ type: [CivEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query() civFindOptions: CivFindOptionsDto,
  ): Promise<CivEntity[]> {
    const civs = await this.civService.findAll(civFindOptions);
    return civs.map((civ) => new CivEntity(civ));
  }

  @ApiOkResponse({ type: CivEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query() civFindOptions: CivFindOptionsDto,
  ): Promise<CivEntity> {
    const civ = await this.civService.findOneById(id, civFindOptions);

    if (!civ) {
      throw new NotFoundException(`Civ id ${id} not found`);
    }

    return new CivEntity(civ);
  }

  @ApiOkResponse({ type: CivEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byName/:name')
  async findOneByName(
    @Param('name') name: string,
    @Query() civFindOptions: CivFindOptionsDto,
  ): Promise<CivEntity> {
    const civ = await this.civService.findOneByName(name, civFindOptions);

    if (!civ) {
      throw new NotFoundException(`Civ name ${name} not found`);
    }

    return new CivEntity(civ);
  }
}
