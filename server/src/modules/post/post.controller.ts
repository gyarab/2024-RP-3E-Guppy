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
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PostService } from './post.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserWithoutPassword } from 'src/auth/types/auth.types';
import { CreatePostDto } from './dto/CreatePostDto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('organization/:organizationId')
  async create(
    @Body() dto: CreatePostDto,
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

    return this.postService.create(dto, user.id, organizationId);
  }

  @HttpCode(HttpStatus.OK)
  @Get('organization/:organizationId')
  async getAll(
    @Request() req,
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('searchType') searchType?: string,
    @Query('query') query?: string,
  ) {
    const user = req.user as UserWithoutPassword;
    if (!user) throw new NotFoundException('User not found');

    return this.postService.posts({
      skip: (page - 1) * limit,
      take: limit,
      searchType,
      query,
      userId: user.id,
      orgId: organizationId,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/organization/:organizationId')
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

  @HttpCode(HttpStatus.OK)
  @Post(':id/like')
  async like(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user as UserWithoutPassword;
    if (!user) throw new NotFoundException('User not found');

    return this.postService.likePost(id, user.id);
  }
}
