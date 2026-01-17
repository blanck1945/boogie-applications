// src/user/dto/create-user.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email del usuario', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Nombre del usuario', required: false, example: 'Juan' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Apellido del usuario', required: false, example: 'Pérez' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Nombre de usuario', required: false, example: 'johndoe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Rol del usuario', required: false, default: 'admin', example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ description: 'Estado activo del usuario', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
