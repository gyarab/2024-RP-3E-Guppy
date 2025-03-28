import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
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
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.comment({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(@Request() req): Promise<Comment[]> {
    const user = req.user as UserWithoutPassword;
    return this.commentService.comments({ userId: user.id });
  }

  @HttpCode(HttpStatus.OK)
  @Get('post/:postId')
  async getByPostId(
    @Param('postId', ParseIntPipe) postId: number,
    @Request() req,
  ): Promise<Comment[]> {
    const user = req.user as UserWithoutPassword;
    return this.commentService.comments({ where: { postId }, userId: user.id });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(':postId')
  async create(
    @Body() data: Prisma.CommentCreateInput,
    @Param('postId', ParseIntPipe) postId: number,
    @Request() req,
  ): Promise<Comment> {
    const user = req.user as UserWithoutPassword;
    return this.commentService.create(data, postId, user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
    return this.commentService.delete({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/like')
  async like(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user as UserWithoutPassword;
    if (!user) throw new NotFoundException('User not found');

    return this.commentService.likeComment(id, user.id);
  }
}
