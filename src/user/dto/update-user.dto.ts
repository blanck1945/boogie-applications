// src/user/dto/update-user.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Email del usuario', required: false, example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Contraseña del usuario', required: false, example: 'newpassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

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

  @ApiProperty({ description: 'Rol del usuario', required: false, example: 'admin' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ description: 'Estado activo del usuario', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
