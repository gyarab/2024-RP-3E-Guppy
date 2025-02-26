import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
import { LikeService } from '../like/like.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly likeService: LikeService,
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
  }): Promise<{ posts: Post[]; count: number }> {
    const { skip, take, cursor, where, orderBy, userId } = params;

    const [posts, count] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: {
          comments: true,
          _count: { select: { likes: true } },
          likes: { where: { userId }, select: { id: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(({ _count, likes, ...post }) => ({
        ...post,
        likes: _count.likes,
        hasLiked: likes.length > 0,
      })),
      count,
    };
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

  async likePost(postId: number, userId: number): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.likeService.togglePostLike(userId, postId);
  }
}
