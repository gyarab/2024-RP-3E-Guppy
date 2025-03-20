import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: {
        postId: data.postId,
        willAttend: { connect: data.willAttend?.map(id => ({ id })) || [] },
        dontKnow: { connect: data.dontKnow?.map(id => ({ id })) || [] },
        wontAttend: { connect: data.wontAttend?.map(id => ({ id })) || [] },
      },
    });
  }

  async findAll() {
    return this.prisma.attendance.findMany({
      include: { post: true, willAttend: true, dontKnow: true, wontAttend: true },
    });
  }

  async findOne(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: { post: true, willAttend: true, dontKnow: true, wontAttend: true },
    });
    if (!attendance) throw new NotFoundException('Attendance record not found');
    return attendance;
  }

  async update(id: number, data: UpdateAttendanceDto) {
    return this.prisma.attendance.update({
      where: { id },
      data: {
        willAttend: { set: data.willAttend?.map(userId => ({ id: userId })) || [] },
        dontKnow: { set: data.dontKnow?.map(userId => ({ id: userId })) || [] },
        wontAttend: { set: data.wontAttend?.map(userId => ({ id: userId })) || [] },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.attendance.delete({ where: { id } });
  }

  async moveUser(attendanceId: number, userId: number, from: 'willAttend' | 'dontKnow' | 'wontAttend', to: 'willAttend' | 'dontKnow' | 'wontAttend') {
    return this.prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        [from]: {
          disconnect: { id: userId }, // Odstranění uživatele ze staré skupiny
        },
        [to]: {
          connect: { id: userId }, // Přidání uživatele do nové skupiny
        },
      },
    });
  }
  
}
