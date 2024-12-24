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

  async likePost(userId: number, postId: number): Promise<Like | null> {
    const post = await this.postService.post({ id: postId });
    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return null;
    }

    return this.prisma.like.create({
      data: { userId, postId },
    });
  }

  async likeComment(userId: number, commentId: number): Promise<Like> {
    const comment = await this.commentService.comment({
      id: commentId,
    });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.prisma.like.upsert({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
      create: { userId, commentId },
      update: {},
    });
  }

  async unlikePost(userId: number, postId: number): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  }

  async unlikeComment(userId: number, commentId: number): Promise<Like> {
    return this.prisma.like.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
  }

  async countPostLikes(postId: number): Promise<number> {
    return this.prisma.like.count({ where: { postId } });
  }

  async countCommentLikes(commentId: number): Promise<number> {
    return this.prisma.like.count({ where: { commentId } });
  }
}
