import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async post(postWhereUniqueInput: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
    userId: number;
  }): Promise<any> {
    const { skip, take, cursor, where, orderBy, userId } = params;

    const posts = await this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        comments: true,
        likes: true,
      },
    });

    return posts.map((post) => {
      const likeCount = post.likes.length;
      const userLiked = post.likes.some((like) => like.userId == userId);

      return {
        ...post,
        likeCount,
        userLiked,
      };
    });
  }

  async create(
    data: Prisma.PostCreateInput,
    userId: number,
    organizationId: number,
  ): Promise<Post> {
    const user = await this.userService.user({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        author: { connect: { id: userId } },
        organization: { connect: { id: organizationId } },
      },
    });
  }

  async update(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prisma.post.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    });
  }

  async checkOrganizationAndMembership(
    organizationId: number,
    userId: number,
  ): Promise<boolean> {
    const membership = await this.prisma.userOrganization.findFirst({
      where: {
        organizationId,
        userId,
      },
    });
    return !!membership;
  }
}
