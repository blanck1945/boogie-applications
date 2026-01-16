// src/user/dto/update-user.dto.ts
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Email del usuario', required: false, example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Nombre de usuario', required: false, example: 'johndoe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Estado activo del usuario', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Roles del usuario', required: false, type: [String], example: ['user'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
