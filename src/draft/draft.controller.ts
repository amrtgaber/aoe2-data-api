import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DraftService } from './draft.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { DraftEntity } from './entities/draft.entity';

@ApiTags('Drafts')
@Controller('draft')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @ApiOkResponse({ type: DraftEntity })
  @Post()
  create(@Body() createDraftDto: CreateDraftDto) {
    return this.draftService.create(createDraftDto);
  }

  @ApiOkResponse({ type: [DraftEntity] })
  @Get()
  findAll() {
    return this.draftService.findAll();
  }

  @ApiOkResponse({ type: DraftEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.draftService.findOne(+id);
  }

  @ApiOkResponse({ type: DraftEntity })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDraftDto: UpdateDraftDto) {
    return this.draftService.update(+id, updateDraftDto);
  }

  @ApiNoContentResponse()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.draftService.remove(+id);
  }
}
