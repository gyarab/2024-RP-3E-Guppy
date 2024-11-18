import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { Like } from '@prisma/client';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  async likePost(userId: string, postId: string): Promise<Like> {
    const post = await this.postService.post({ id: postId });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.like.upsert({
      where: {
        unique_user_post_like: {
          userId,
          postId,
        },
      },
      create: { userId, postId },
      update: {},
    });
  }

  async likeComment(userId: string, commentId: string): Promise<Like> {
    const comment = await this.commentService.comment({
      id: commentId,
    });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.prisma.like.upsert({
      where: {
        unique_user_comment_like: {
          userId,
          commentId,
        },
      },
      create: { userId, commentId },
      update: {},
    });
  }

  async unlikePost(userId: string, postId: string): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        unique_user_post_like: {
          userId,
          postId,
        },
      },
    });
  }

  async unlikeComment(userId: string, commentId: string): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        unique_user_comment_like: {
          userId,
          commentId,
        },
      },
    });
  }

  async countPostLikes(postId: string): Promise<number> {
    return this.prisma.like.count({ where: { postId } });
  }

  async countCommentLikes(commentId: string): Promise<number> {
    return this.prisma.like.count({ where: { commentId } });
  }
}
