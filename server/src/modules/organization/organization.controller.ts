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
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/CreateOrganizationDto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get(':id')
  async getOrganization(@Param('id', ParseIntPipe) id: number) {
    return this.organizationService.organization({ id });
  }

  @Get()
  async getOrganizations(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('orderBy') orderBy?: Prisma.OrganizationOrderByWithRelationInput,
    @Query('where') where?: Prisma.OrganizationWhereInput,
  ) {
    return this.organizationService.organizations({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      orderBy,
      where,
    });
  }

  @Post()
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    const { creatorId } = createOrganizationDto;
    return this.organizationService.create(createOrganizationDto, creatorId);
  }

  @Put(':id')
  async updateOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.OrganizationUpdateInput,
  ) {
    return this.organizationService.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  async deleteOrganization(@Param('id', ParseIntPipe) id: number) {
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
}
