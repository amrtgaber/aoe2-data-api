import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { AccessGuard } from '../auth/guard/access.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users')
@UseGuards(AccessGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getSelf(@GetUser() user: User) {
    return user;
  }

  @ApiOkResponse({ type: UserEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch()
  async update(@Body() dto: UpdateUserDto, @GetUser() user: User) {
    return await this.userService.update(user, dto);
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  remove(@GetUser('id') id: number) {
    return this.userService.remove(id);
  }
}
