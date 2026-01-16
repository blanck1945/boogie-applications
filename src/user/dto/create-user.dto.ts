// src/user/dto/create-user.dto.ts
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email del usuario', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Nombre de usuario', example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Estado activo del usuario', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Roles del usuario', required: false, type: [String], example: ['user'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
