import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma, Tag } from '@prisma/client';
import { UserService } from '../user/user.service';
import { LikeService } from '../like/like.service';
import { CreatePostDto } from './dto/CreatePostDto';
import { Role } from 'src/auth/enum/roles.enum';

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
    searchType?: string;
    query?: string;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
    userId: number;
  }): Promise<{ posts: Post[]; count: number }> {
    const { skip, take, searchType, query, cursor, where, orderBy, userId } =
      params;

    let searchWhere: Prisma.PostWhereInput = { ...where };
    if (searchType && query) {
      const searchQuery = { contains: query };

      switch (searchType) {
        case 'title':
          searchWhere.title = searchQuery;
          break;
        case 'tags':
          searchWhere.tags = {
            some: {
              name: searchQuery,
            },
          };
          break;
        case 'user':
          searchWhere.author = {
            name: searchQuery,
          };
          break;
        default:
          throw new BadRequestException('Invalid search type');
      }
    }

    const [posts, count] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip,
        take,
        cursor,
        where: searchWhere,
        orderBy,
        include: {
          comments: true,
          _count: { select: { likes: true, comments: true } },
          likes: { where: { userId }, select: { id: true } },
          tags: { select: { name: true } },
          author: { select: { name: true, profilePictureUrl: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(({ _count, likes, ...post }) => ({
        ...post,
        likes: _count.likes,
        commentsCount: _count.comments,
        hasLiked: likes.length > 0,
      })),
      count,
    };
  }

  async create(
    dto: CreatePostDto,
    userId: number,
    organizationId: number,
  ): Promise<Post> {
    const { title, content, tags } = dto;

    return this.prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
        organization: { connect: { id: organizationId } },
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        tags: true,
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
        role: { name: { in: [Role.MEMBER, Role.OWNER] } },
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
