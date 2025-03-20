import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, PrismaService]
})
export class AttendanceModule {}
