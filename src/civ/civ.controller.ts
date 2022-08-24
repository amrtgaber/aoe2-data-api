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
  NotFoundException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiOkResponse({ type: CivEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Civ> {
    const civ = await this.civService.findOne(+id);

    if (!civ) {
      throw new NotFoundException('Civ id not found');
    }

    return civ;
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
