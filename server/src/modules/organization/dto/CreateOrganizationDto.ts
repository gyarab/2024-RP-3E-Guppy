import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  description: string;
  logoUrl: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  userIds: number[];
}
