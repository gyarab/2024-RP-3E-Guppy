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
  async likePost(@Param('postId') postId: string, @Request() req) {
    const user = req.user as UserWithoutPassword;

    return this.likeService.likePost(user.id, postId);
  }

  @Post('comment/:commentId')
  async likeComment(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
  ) {
    return this.likeService.likeComment(userId, commentId);
  }

  @Delete('post/:postId')
  async unlikePost(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    return this.likeService.unlikePost(userId, postId);
  }

  @Delete('comment/:commentId')
  async unlikeComment(
    @Param('commentId') commentId: string,
    @Param('userId') userId: string,
  ) {
    return this.likeService.unlikeComment(userId, commentId);
  }

  @Get('post/:postId/count')
  async countPostLikes(@Param('postId') postId: string) {
    return this.likeService.countPostLikes(postId);
  }

  @Get('comment/:commentId/count')
  async countCommentLikes(@Param('commentId') commentId: string) {
    return this.likeService.countCommentLikes(commentId);
  }
}
