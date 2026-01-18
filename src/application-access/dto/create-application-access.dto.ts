// src/application-access/dto/create-application-access.dto.ts
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateApplicationAccessDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(['ALLOW', 'DENY'])
  effect?: 'ALLOW' | 'DENY';

  @IsOptional()
  @IsIn(['VIEWER', 'EDITOR', 'ADMIN'])
  role?: 'VIEWER' | 'EDITOR' | 'ADMIN';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
