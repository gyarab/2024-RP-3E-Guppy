import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.users({
      orderBy: {
        id: 'desc',
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.user({
      id,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.create(data);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.update({
      where: {
        id,
      },
      data,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<User> {
    return this.userService.delete({
      id,
    });
  }
}
