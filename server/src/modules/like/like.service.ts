import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    return this.prisma.like.create({
      data: { userId, postId },
    });
  }

  async unlikePost(userId: number, postId: number) {
    return this.prisma.like.deleteMany({
      where: { userId, postId },
    });
  }

  async togglePostLike(userId: number, postId: number) {
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      return this.prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      return this.prisma.like.create({
        data: { userId, postId },
      });
    }
  }

  async hasUserLikedPost(userId: number, postId: number): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
    return !!like;
  }

  async likeComment(userId: number, commentId: number) {
    return this.prisma.like.create({
      data: { userId, commentId },
    });
  }

  async unlikeComment(userId: number, commentId: number) {
    return this.prisma.like.deleteMany({
      where: { userId, commentId },
    });
  }

  async toggleCommentLike(userId: number, commentId: number) {
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, commentId },
    });

    if (existingLike) {
      return this.prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      return this.prisma.like.create({
        data: { userId, commentId },
      });
    }
  }
}
