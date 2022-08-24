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
import { Unit } from '@prisma/client';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UnitEntity } from './entities/unit.entity';

@ApiTags('Units')
@Controller('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @ApiCreatedResponse({ type: UnitEntity })
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return this.unitService.create(createUnitDto);
  }

  @ApiOkResponse({ type: [UnitEntity] })
  @Get()
  findAll(): Promise<Unit[]> {
    return this.unitService.findAll();
  }

  @ApiOkResponse({ type: UnitEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Unit> {
    const unit = await this.unitService.findOne(+id);

    if (!unit) {
      throw new NotFoundException('Unit id not found');
    }

    return unit;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit> {
    return this.unitService.update(+id, updateUnitDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(+id);
  }
}
