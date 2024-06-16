import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(user: User, dto: UpdateUserDto) {
    const data = {
      ...user,
      ...dto,
    };

    delete data.password;

    let hash: string;
    if (dto.password) {
      hash = await argon.hash(dto.password);
      data.hash = hash;
      console.log({ hash });
    }

    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
