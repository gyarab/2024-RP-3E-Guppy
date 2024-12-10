import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserWithoutPassword } from 'src/auth/types/auth.types';

@UseGuards(AuthGuard)
@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('post/:postId')
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Request() req,
  ) {
    const user = req.user as UserWithoutPassword;

    return this.likeService.likePost(user.id, postId);
  }

  @Post('comment/:commentId')
  async likeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likeService.likeComment(userId, commentId);
  }

  @Delete('post/:postId')
  async unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likeService.unlikePost(userId, postId);
  }

  @Delete('comment/:commentId')
  async unlikeComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likeService.unlikeComment(userId, commentId);
  }

  @Get('post/:postId/count')
  async countPostLikes(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.countPostLikes(postId);
  }

  @Get('comment/:commentId/count')
  async countCommentLikes(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.likeService.countCommentLikes(commentId);
  }
}
