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

import { UnitEntity } from './entities/unit.entity';
import { UnitService } from './unit.service';
import { UnitFindOptionsDto } from './dto/unit-find-options.dto';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @ApiOkResponse({ type: [UnitEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query() unitFindOptions: UnitFindOptionsDto,
  ): Promise<UnitEntity[]> {
    const units = await this.unitService.findAll(unitFindOptions);
    return units.map((unit) => new UnitEntity(unit));
  }

  @ApiOkResponse({ type: UnitEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query() unitFindOptions: UnitFindOptionsDto,
  ): Promise<UnitEntity> {
    const unit = await this.unitService.findOneById(id, unitFindOptions);

    if (!unit) {
      throw new NotFoundException(`Unit id ${id} not found`);
    }

    return new UnitEntity(unit);
  }

  @ApiOkResponse({ type: UnitEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byName/:name')
  async findOneByName(
    @Param('name') name: string,
    @Query() unitFindOptions: UnitFindOptionsDto,
  ): Promise<UnitEntity> {
    const unit = await this.unitService.findOneByName(name, unitFindOptions);

    if (!unit) {
      throw new NotFoundException(`Unit name ${name} not found`);
    }

    return new UnitEntity(unit);
  }
}
