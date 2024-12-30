import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Organization, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

import { CreateOrganizationDto } from './dto/CreateOrganizationDto';
import { generateRandomString } from '../../common/utils/randomString';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async organization(
    organizationWhereUniqueInput: Prisma.OrganizationWhereUniqueInput,
  ) {
    return this.prisma.organization.findUnique({
      where: organizationWhereUniqueInput,
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        posts: true, // zakomentovat
      },
    });
  }

  async organizations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganizationWhereUniqueInput;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.organization.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        posts: true, // zakomentovat
      },
    });
  }

  async create(
    organizationCreateDto: CreateOrganizationDto,
    userId: number,
  ): Promise<Organization> {
    const { name, userIds } = organizationCreateDto;

    const creator = await this.userService.user({ id: userId });
    if (!creator) {
      throw new NotFoundException('Creator user not found');
    }

    const users = await this.userService.users({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length) {
      throw new BadRequestException('Some users not found');
    }

    const memberRole = await this.prisma.role.findUnique({
      where: { name: 'Member' },
    });
    if (!memberRole) {
      await this.prisma.role.create({
        data: {
          name: 'Member',
        },
      });
    }

    const urlLink = await generateRandomString(8);

    return this.prisma.organization.create({
      data: {
        name,
        creatorId: userId,
        joinUrl: urlLink,
        users: {
          create: userIds.map((uid) => ({
            user: { connect: { id: uid } },
            role: { connect: { name: 'Member' } },
          })),
        },
      },
    });
  }

  async update(params: {
    where: Prisma.OrganizationWhereUniqueInput;
    data: Prisma.OrganizationUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.organization.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.OrganizationWhereUniqueInput) {
    return this.prisma.organization.delete({
      where,
    });
  }

  async addUserToOrganization(
    organizationId: number,
    userId: number,
  ): Promise<Organization> {
    const organization = await this.organization({ id: organizationId });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const user = await this.userService.user({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        users: {
          create: {
            user: { connect: { id: userId } },
            role: { connect: { name: 'Member' } },
          },
        },
      },
    });
  }

  async removeUserFromOrganization(
    organizationId: number,
    userId: number,
  ): Promise<Organization> {
    const organization = await this.organization({ id: organizationId });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const user = await this.userService.user({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        users: {
          delete: {
            userId_organizationId: {
              userId,
              organizationId,
            },
          },
        },
      },
    });
  }

  async updateRole(
    organizationId: number,
    userId: number,
    roleName: string,
  ): Promise<Organization> {
    const organization = await this.organization({ id: organizationId });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const user = await this.userService.user({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        users: {
          update: {
            where: { userId_organizationId: { userId, organizationId } },
            data: { role: { connect: { name: roleName } } },
          },
        },
      },
    });
  }

  async joinOrganization(
    joinUrl: string,
    userId: number,
  ): Promise<Organization> {
    const organization = await this.organization({ joinUrl: joinUrl });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const user = await this.userService.user({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.organization.update({
      where: { joinUrl: organization.joinUrl },
      data: {
        users: {
          create: {
            user: { connect: { id: userId } },
            role: { connect: { name: 'Member' } },
          },
        },
      },
    });
  }
}
