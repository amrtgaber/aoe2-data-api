import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BuildingEntity } from './entities/building.entity';
import { BuildingService } from './building.service';
import { BuildingFindOptionsDto } from './dto/building-find-options.dto';

@ApiTags('Buildings')
@Controller('buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @ApiOkResponse({ type: [BuildingEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query() buildingFindOptions: BuildingFindOptionsDto,
  ): Promise<BuildingEntity[]> {
    const buildings = await this.buildingService.findAll(buildingFindOptions);
    return buildings.map((building) => new BuildingEntity(building));
  }

  @ApiOkResponse({ type: BuildingEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query() buildingFindOptions: BuildingFindOptionsDto,
  ): Promise<BuildingEntity> {
    const building = await this.buildingService.findOneById(
      id,
      buildingFindOptions,
    );

    if (!building) {
      throw new NotFoundException(`Building id ${id} not found`);
    }

    return new BuildingEntity(building);
  }

  @ApiOkResponse({ type: BuildingEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byName/:name')
  async findOneByName(
    @Param('name') name: string,
    @Query() buildingFindOptions: BuildingFindOptionsDto,
  ): Promise<BuildingEntity> {
    const building = await this.buildingService.findOneByName(
      name,
      buildingFindOptions,
    );

    if (!building) {
      throw new NotFoundException(`Building name ${name} not found`);
    }

    return new BuildingEntity(building);
  }
}
