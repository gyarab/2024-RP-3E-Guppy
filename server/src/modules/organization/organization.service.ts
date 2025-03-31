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
import { Role } from '../../auth/enum/roles.enum';
import { log } from 'console';

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
      },
    });
  }

  async organizationInfo(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          include: { user: true, role: true },
        },
        posts: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const members = organization.users.map(({ user, role }) => ({
      user,
      role,
    }));

    return {
      name: organization.name,
      description: organization.description,
      totalPosts: organization.posts.length,
      totalMembers: members.length,
      owner: members.find((member) => member.role.name === Role.OWNER).user,
      joinCode: organization.joinCode,
    };
  }

  async organizations(params: {
    userId: number;
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganizationWhereUniqueInput;
    where?: Prisma.OrganizationWhereInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy, userId } = params;

    const organizations = await this.prisma.organization.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        users: {
          select: {
            userId: true,
          },
        },
      },
    });

    const processedOrganizations = organizations
      .map((org) => ({
        id: org.id,
        name: org.name,
        description: org.description,
        logoUrl: org.logoUrl,
        createdAt: org.createdAt,
        userJoined: org.users.some((userOrg) => userOrg.userId === userId),
      }))
      .sort((a, b) => Number(a.userJoined) - Number(b.userJoined));

    return { organizations: processedOrganizations };
  }

  async userOrganizations(params: {
    userId: number;
    skip?: number;
    take?: number;
    cursor?: Prisma.OrganizationWhereUniqueInput;
    orderBy?: Prisma.OrganizationOrderByWithRelationInput;
  }) {
    const { userId, skip, take, cursor, orderBy } = params;

    const where = {
      users: {
        some: {
          userId,
        },
      },
    };

    const [organizations, totalCount] = await this.prisma.$transaction([
      this.prisma.organization.findMany({
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
        },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return { organizations, count: totalCount };
  }

  async create(
    organizationCreateDto: CreateOrganizationDto,
    userId: number,
  ): Promise<Organization> {
    const { name, description, logoUrl, userIds } = organizationCreateDto;

    const creator = await this.userService.user({ id: userId });
    if (!creator) {
      throw new NotFoundException('Creator user not found');
    }

    const roles = await this.prisma.role.findMany({
      where: { name: { in: [Role.OWNER, Role.MEMBER] } },
    });

    let ownerRole = roles.find((role) => role.name === Role.OWNER);
    let memberRole = roles.find((role) => role.name === Role.MEMBER);

    if (!ownerRole) {
      ownerRole = await this.prisma.role.create({
        data: { name: Role.OWNER },
      });
    }

    if (!memberRole) {
      memberRole = await this.prisma.role.create({
        data: { name: Role.MEMBER },
      });
    }

    let usersToAdd = [];
    if (userIds && userIds.length > 0) {
      const users = await this.userService.users({
        where: { id: { in: userIds } },
      });

      if (users.length !== userIds.length) {
        throw new BadRequestException('Some users not found');
      }

      usersToAdd = users.map((user) => ({
        user: { connect: { id: user.id } },
        role: { connect: { id: memberRole.id } },
      }));
    }

    const existingCodes = (
      await this.prisma.organization.findMany({ select: { joinCode: true } })
    ).map(({ joinCode }) => joinCode);

    let uniqueCode = '';
    do {
      uniqueCode = await generateRandomString(6);
    } while (existingCodes.includes(uniqueCode));

    return this.prisma.organization.create({
      data: {
        name,
        description,
        logoUrl,
        joinCode: uniqueCode,
        users: {
          create: [
            {
              user: { connect: { id: userId } },
              role: { connect: { id: ownerRole.id } },
            },
            ...usersToAdd,
          ],
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
            role: { connect: { name: Role.MEMBER } },
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
    joinCode: string,
    userId: number,
  ): Promise<Organization> {
    const organization = await this.organization({ joinCode: joinCode });
    if (!organization) {
      throw new NotFoundException('Invalid join code');
    }

    const user = await this.userService.user({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.organization.update({
      where: { joinCode: organization.joinCode },
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

  async checkName(name: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { name },
    });

    return { available: !organization };
  }
}
