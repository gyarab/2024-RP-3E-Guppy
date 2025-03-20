import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsOptional()
  @IsInt({ each: true })
  willAttend?: number[];

  @IsOptional()
  @IsInt({ each: true })
  dontKnow?: number[];

  @IsOptional()
  @IsInt({ each: true })
  wontAttend?: number[];
}
