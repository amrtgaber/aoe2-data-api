import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeEntity } from './entities/like.entity';
import { LikeService } from './like.service';

@ApiTags('Likes')
@UseGuards(JwtGuard)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @ApiCreatedResponse({ type: LikeEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateLikeDto, @GetUser('id') userId: number) {
    return await this.likeService.create(dto, userId);
  }

  @ApiOkResponse({ type: [LikeEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@GetUser('id') userId: number) {
    return await this.likeService.findAll(userId);
  }

  @ApiOkResponse({ type: [LikeEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.likeService.findOne(+id, userId);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.likeService.remove(+id, userId);
  }
}
