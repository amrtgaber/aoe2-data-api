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

import { AgeEntity } from './entities/age.entity';
import { AgeService } from './age.service';
import { AgeFindOptionsDto } from './dto/age-find-options.dto';

@ApiTags('Ages')
@Controller('ages')
export class AgeController {
  constructor(private readonly ageService: AgeService) {}

  @ApiOkResponse({ type: [AgeEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query() ageFindOptions: AgeFindOptionsDto,
  ): Promise<AgeEntity[]> {
    const ages = await this.ageService.findAll(ageFindOptions);
    return ages.map((age) => new AgeEntity(age));
  }

  @ApiOkResponse({ type: AgeEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(
    @Param('id') id: number,
    @Query() ageFindOptions: AgeFindOptionsDto,
  ): Promise<AgeEntity> {
    const age = await this.ageService.findOneById(id, ageFindOptions);

    if (!age) {
      throw new NotFoundException(`Age id ${id} not found`);
    }

    return new AgeEntity(age);
  }

  @ApiOkResponse({ type: AgeEntity })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byName/:name')
  async findOneByName(
    @Param('name') name: string,
    @Query() ageFindOptions: AgeFindOptionsDto,
  ): Promise<AgeEntity> {
    const age = await this.ageService.findOneByName(name, ageFindOptions);

    if (!age) {
      throw new NotFoundException(`Age name ${name} not found`);
    }

    return new AgeEntity(age);
  }
}
