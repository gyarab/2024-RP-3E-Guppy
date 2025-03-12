import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LikeService } from '../like/like.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private likeService: LikeService,
  ) {}

  async comment(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment> {
    return this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    });
  }

  async comments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
    userId: number;
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy, userId } = params;

    const comments = await this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        author: { select: { name: true, profilePictureUrl: true } },
        _count: { select: { likes: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    });

    return comments.map(({ _count, likes, ...comment }) => ({
      ...comment,
      hasLiked: likes.length > 0,
      likes: _count.likes,
    }));
  }

  async create(
    data: Prisma.CommentCreateInput,
    commentId: number,
    authorId: number,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        ...data,
        post: {
          connect: {
            id: commentId,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
  }

  async delete(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    return this.prisma.comment.delete({
      where,
    });
  }

  async likeComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.likeService.toggleCommentLike(userId, commentId);
  }
}
