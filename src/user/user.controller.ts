// src/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // AUTH ENDPOINTS (PONER ARRIBA DE :id)
  // =========================

  @Get('test-token')
  @ApiOperation({ summary: 'Obtener token JWT de testing (sin autenticación)' })
  @ApiResponse({
    status: 200,
    description: 'Token JWT generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'JWT token' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            roles: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getTestToken() {
    const email = 'admin@example.com';
    const username = 'Salvador';
    
    const user = await this.service.findByEmail(email);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 1) payload
    const payload = {
      id: user.id,
      sub: email,
      username,
      email,
      roles: ['admin'],
    };

    // 2) token
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });

    // 3) devolver token en JSON
    return {
      token,
      user: {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        roles: payload.roles,
      },
    };
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario autenticado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', nullable: true },
        username: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        roles: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado - Token no proporcionado o inválido' })
  getMe(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      const payload = this.jwtService.verify(token);

      return res.json({
        // si no usás sub, no lo invento; devolvemos lo que está en el token
        id: payload.sub ?? null,
        username: payload.username ?? null,
        email: payload.email ?? null,
        roles: payload.roles ?? [],
      });
    } catch {
      throw new UnauthorizedException('INVALID TOKEN');
    }
  }

  @Get('login')
  @ApiOperation({ summary: 'Login de usuario - Genera token JWT' })
  @ApiQuery({ name: 'relayState', required: false, description: 'URL de redirección después del login' })
  @ApiQuery({ name: 'username', required: true, description: 'Nombre de usuario' })
  @ApiQuery({ name: 'email', required: true, description: 'Email del usuario' })
  @ApiResponse({
    status: 302,
    description: 'Redirección con token en query parameter',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async handleCallback(
    @Query('relayState') relayState: string,
    @Query('username') username: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    try {

      // const user = await this.service.findByEmail('aspastrana990@gmail.com');
      const user = await this.service.findByEmail('admin@example.com');
      console.log('user', user);
    if (!user) throw new NotFoundException();

    // 1) payload
    const payload = {
      id: user.id,
      sub: email, // ✅ útil como "id" lógico (o podés usar un id real si lo tenés)
      username,
      email,
      roles: ['admin'], // opcional: o sacalo si no querés hardcodear
    };
    
    // 2) token
    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
    });

    // 3) redirect con token en query parameter
    const redirectUrl = relayState || 'http://localhost:5173/';
    const separator = redirectUrl.includes('?') ? '&' : '?';
    return res.redirect(`${redirectUrl}${separator}token=${token}`);
  } catch (error) {
    console.error('Error en login:', error);
    throw new InternalServerErrorException('Error en login');
  }
  }

  // =========================
  // CRUD USERS
  // =========================

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiQuery({ name: 'q', required: false, description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll(@Query('q') q?: string) {
    return this.service.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
