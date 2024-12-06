import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserWithoutPassword } from 'src/auth/types/auth.types';

@UseGuards(AuthGuard)
@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('post/:postId')
  async likePost(@Param('postId') postId: number, @Request() req) {
    const user = req.user as UserWithoutPassword;

    return this.likeService.likePost(user.id, postId);
  }

  @Post('comment/:commentId')
  async likeComment(
    @Param('commentId') commentId: number,
    @Param('userId') userId: number,
  ) {
    return this.likeService.likeComment(userId, commentId);
  }

  @Delete('post/:postId')
  async unlikePost(
    @Param('postId') postId: number,
    @Param('userId') userId: number,
  ) {
    return this.likeService.unlikePost(userId, postId);
  }

  @Delete('comment/:commentId')
  async unlikeComment(
    @Param('commentId') commentId: number,
    @Param('userId') userId: number,
  ) {
    return this.likeService.unlikeComment(userId, commentId);
  }

  @Get('post/:postId/count')
  async countPostLikes(@Param('postId') postId: number) {
    return this.likeService.countPostLikes(postId);
  }

  @Get('comment/:commentId/count')
  async countCommentLikes(@Param('commentId') commentId: number) {
    return this.likeService.countCommentLikes(commentId);
  }
}
