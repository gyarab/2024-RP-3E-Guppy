import { CreateAttendanceDto } from './create-attendance.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
