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
  NotFoundException,
  BadRequestException,
  Req,
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
  @Post('organization/:organizationId')
  async create(
    @Body() data: Prisma.PostCreateInput,
    @Request() req,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ) {
    const user = req.user as UserWithoutPassword;
    if (!user) throw new NotFoundException('User not found');

    if (
      !(await this.postService.checkOrganizationAndMembership(
        organizationId,
        user.id,
      ))
    ) {
      throw new BadRequestException('User is not a member of the organization');
    }

    return this.postService.create(data, user.id, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(@Request() req) {
    const userId = (req.user as UserWithoutPassword).id;
    return this.postService.posts({ userId });
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
