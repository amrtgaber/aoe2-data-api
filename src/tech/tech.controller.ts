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
import { Tech } from '@prisma/client';

import { JwtGuard } from '../auth/guard/jwt.guard';
import { TechService } from './tech.service';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { TechEntity } from './entities/tech.entity';

@ApiTags('Techs')
@Controller('techs')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @ApiCreatedResponse({ type: TechEntity })
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createTechDto: CreateTechDto): Promise<Tech> {
    return this.techService.create(createTechDto);
  }

  @ApiOkResponse({ type: [TechEntity] })
  @Get()
  findAll(): Promise<Tech[]> {
    return this.techService.findAll();
  }

  @ApiOkResponse({ type: TechEntity })
  @ApiNotFoundResponse()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tech> {
    const tech = await this.techService.findOne(+id);

    if (!tech) {
      throw new NotFoundException('Tech id not found');
    }

    return tech;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechDto: UpdateTechDto,
  ): Promise<Tech> {
    return this.techService.update(+id, updateTechDto);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.techService.remove(+id);
  }
}
