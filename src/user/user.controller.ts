import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getSelf(@GetUser() user: User) {
    return user;
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @GetUser('id') id: number) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete()
  remove(@GetUser('id') id: number) {
    return this.userService.remove(id);
  }
}
