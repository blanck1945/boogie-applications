// src/application-access/dto/update-application-access.dto.ts
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class UpdateApplicationAccessDto {
  @IsOptional()
  @IsIn(['ALLOW', 'DENY'])
  effect?: 'ALLOW' | 'DENY';

  @IsOptional()
  @IsIn(['VIEWER', 'EDITOR', 'ADMIN'])
  role?: 'VIEWER' | 'EDITOR' | 'ADMIN';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
