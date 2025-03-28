import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AuthGuard } from '../../auth/guards/auth.guard';
import { OrganizationService } from './organization.service';

import { UserWithoutPassword } from '../../auth/types/auth.types';
import { CreateOrganizationDto } from './dto/CreateOrganizationDto';

@UseGuards(AuthGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('user')
  async getUserOrganizations(
    @Request() req,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('orderBy') orderBy?: Prisma.OrganizationOrderByWithRelationInput,
  ) {
    const user = req.user as UserWithoutPassword;
    return this.organizationService.userOrganizations({
      userId: user.id,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.organization({ id });
  }

  @Get(':id/info')
  async getOrganizationInfo(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.organizationInfo(id);
  }

  @Get()
  async getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Request() req,
    @Query('orderBy') orderBy?: Prisma.OrganizationOrderByWithRelationInput,
    @Query('searchType') searchType?: string,
    @Query('query') query?: string,
  ) {
    const user = req.user as UserWithoutPassword;

    return this.organizationService.organizations({
      userId: user.id,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      where: query ? this.getSearchCondition(searchType, query) : undefined,
    });
  }

  private getSearchCondition(
    searchType: string,
    query: string,
  ): Prisma.OrganizationWhereInput {
    if (!query) return {};

    // Convert query to lowercase for case-insensitive search
    const lowercaseQuery = query.toLowerCase();

    switch (searchType) {
      case 'name':
        return {
          name: {
            contains: lowercaseQuery,
          },
        };
      case 'description':
        return {
          description: {
            contains: lowercaseQuery,
          },
        };
      default:
        return {
          OR: [
            {
              name: {
                contains: lowercaseQuery,
              },
            },
            {
              description: {
                contains: lowercaseQuery,
              },
            },
          ],
        };
    }
  }

  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Request() req,
  ) {
    const creator = req.user as UserWithoutPassword;
    return this.organizationService.create(createOrganizationDto, creator.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.OrganizationUpdateInput,
  ) {
    return this.organizationService.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.delete({ id });
  }

  @Post(':organizationId/users/:userId')
  async addUserToOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.organizationService.addUserToOrganization(
      organizationId,
      userId,
    );
  }

  @Delete(':organizationId/users/:userId')
  async removeUserFromOrganization(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.organizationService.removeUserFromOrganization(
      organizationId,
      userId,
    );
  }

  @Put(':organizationId/users/:userId/role')
  async updateRole(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('roleName') roleName: string,
  ) {
    return this.organizationService.updateRole(
      organizationId,
      userId,
      roleName,
    );
  }

  @Put('/join/:joinCode')
  async joinOrganization(@Param('joinCode') joinCode: string, @Request() req) {
    const user = req.user as UserWithoutPassword;
    if (!user) throw new NotFoundException('User not found');
    return this.organizationService.joinOrganization(joinCode, user.id);
  }

  @Post('check-name')
  async checkName(@Body('name') name: string) {
    return this.organizationService.checkName(name);
  }
}
