import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  providers: [OrganizationService, PrismaService, UserService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
