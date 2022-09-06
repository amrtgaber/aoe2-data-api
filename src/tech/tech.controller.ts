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

import { TechEntity } from './entities/tech.entity';
import { TechService } from './tech.service';
import { TechFindOptionsDto } from './dto/tech-find-options.dto';

@ApiTags('Techs')
@Controller('techs')
export class TechController {
  constructor(private readonly techService: TechService) {}

  @ApiOkResponse({ type: [TechEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query() techFindOptions: TechFindOptionsDto,
  ): Promise<TechEntity[]> {
    const techs = await this.techService.findAll(techFindOptions);
    return techs.map((tech) => new TechEntity(tech));
  }

  @ApiOkResponse({ type: TechEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query() techFindOptions: TechFindOptionsDto,
  ): Promise<TechEntity> {
    const tech = await this.techService.findOneById(id, techFindOptions);

    if (!tech) {
      throw new NotFoundException(`Tech id ${id} not found`);
    }

    return new TechEntity(tech);
  }

  @ApiOkResponse({ type: TechEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byName/:name')
  async findOneByName(
    @Param('name') name: string,
    @Query() techFindOptions: TechFindOptionsDto,
  ): Promise<TechEntity> {
    const tech = await this.techService.findOneByName(name, techFindOptions);

    if (!tech) {
      throw new NotFoundException(`Tech name ${name} not found`);
    }

    return new TechEntity(tech);
  }
}
