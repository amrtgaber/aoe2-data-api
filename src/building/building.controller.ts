import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Building } from '@prisma/client';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { BuildingEntity } from './entities/building.entity';

@ApiTags('Buildings')
@Controller('buildings')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @ApiCreatedResponse({ type: BuildingEntity })
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
    return this.buildingService.create(createBuildingDto);
  }

  @ApiOkResponse({ type: [BuildingEntity] })
  @Get()
  findAll(): Promise<Building[]> {
    return this.buildingService.findAll();
  }

  @ApiOkResponse({ type: BuildingEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Building> {
    const building = await this.buildingService.findOne(+id);

    if (!building) {
      throw new NotFoundException('Building id not found');
    }

    return building;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    return this.buildingService.update(+id, updateBuildingDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingService.remove(+id);
  }
}
