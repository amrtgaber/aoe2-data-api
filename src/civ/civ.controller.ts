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
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Civ } from '@prisma/client';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { CivService } from './civ.service';
import { CreateCivDto } from './dto/create-civ.dto';
import { UpdateCivDto } from './dto/update-civ.dto';
import { CivEntity } from './entities/civ.entity';

@ApiTags('Civs')
@Controller('civs')
export class CivController {
  constructor(private readonly civService: CivService) {}

  @ApiCreatedResponse({ type: CivEntity })
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createCivDto: CreateCivDto): Promise<Civ> {
    return this.civService.create(createCivDto);
  }

  @ApiOkResponse({ type: [CivEntity] })
  @Get()
  findAll(): Promise<Civ[]> {
    return this.civService.findAll();
  }

  @ApiOkResponse({ type: CivEntity || /* istanbul ignore next */ null })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Civ | null> {
    return this.civService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCivDto: UpdateCivDto,
  ): Promise<Civ> {
    return this.civService.update(+id, updateCivDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.civService.remove(+id);
  }
}
