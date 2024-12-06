import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserWithoutPassword } from 'src/auth/types/auth.types';

@UseGuards(AuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Comment> {
    return this.commentService.comment({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(): Promise<Comment[]> {
    return this.commentService.comments({});
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':postId')
  async create(
    @Body() data: Prisma.CommentCreateInput,
    @Param('postId') postId: number,
    @Request() req,
  ): Promise<Comment> {
    const user = req.user as UserWithoutPassword;
    return this.commentService.create(data, postId, user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Param('data') data: Prisma.CommentUpdateInput,
  ): Promise<Comment> {
    return this.commentService.update({ where: { id }, data });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Comment> {
    return this.commentService.delete({ id });
  }
}
