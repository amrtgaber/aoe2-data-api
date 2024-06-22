import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { DraftService } from './draft.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { DraftEntity } from './entities/draft.entity';

@ApiTags('Drafts')
@Controller('drafts')
export class DraftController {
  constructor(private readonly draftService: DraftService) {}

  @ApiCreatedResponse({ type: DraftEntity })
  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateDraftDto, @GetUser('id') userId: number) {
    return await this.draftService.create(dto, userId);
  }

  @ApiOkResponse({ type: [DraftEntity] })
  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@GetUser('id') userId: number) {
    return await this.draftService.findAll(userId);
  }

  @ApiOkResponse({ type: DraftEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.draftService.findOne(+id);
  }

  @ApiOkResponse({ type: DraftEntity })
  @UseGuards(JwtGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDraftDto,
    @GetUser('id') userId: number,
  ) {
    return await this.draftService.update(+id, dto, userId);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return await this.draftService.remove(+id, userId);
  }
}
