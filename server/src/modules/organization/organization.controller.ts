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
  DefaultValuePipe,
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

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.organization({ id });
  }

  @Get()
  async getAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('orderBy') orderBy?: Prisma.OrganizationOrderByWithRelationInput,
    @Query('where') where?: Prisma.OrganizationWhereInput,
  ) {
    return this.organizationService.organizations({
      skip,
      take,
      orderBy,
      where,
    });
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

  @Put('/join/:joinUrl')
  async joinOrganization(@Param('joinUrl') joinUrl: string, @Request() req) {
    const user = req.user as UserWithoutPassword;
    if (!user) throw new NotFoundException('User not found');
    return this.organizationService.joinOrganization(joinUrl, user.id);
  }
}
