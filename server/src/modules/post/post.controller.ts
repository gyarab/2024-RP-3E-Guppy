import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserWithoutPassword } from 'src/auth/types/auth.types';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() data: Prisma.PostCreateInput, @Request() req) {
    const user = req.user as UserWithoutPassword;

    // TODO get organizationId from user

    const organizationId = 1;
    return this.postService.create(data, user.id, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll() {
    return this.postService.posts({});
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.post({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.PostUpdateInput,
  ) {
    return this.postService.update({ where: { id }, data });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.postService.delete({ id });
  }
}
