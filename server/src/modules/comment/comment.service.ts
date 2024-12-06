import { Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

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
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(
    data: Prisma.CommentCreateInput,
    postId: number,
    authorId: number,
  ): Promise<Comment> {
    return this.prisma.comment.create({
      data: {
        ...data,
        post: {
          connect: {
            id: postId,
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

  async update(params: {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.CommentUpdateInput;
  }): Promise<Comment> {
    const { where, data } = params;
    return this.prisma.comment.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    return this.prisma.comment.delete({
      where,
    });
  }
}
