import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('me')
  getMe(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['auth_token']; // o header Authorization, lo que uses

    if (!token) {
      throw new UnauthorizedException('NOT PASS');
    }

    // si hay token y es válido, devolvés el usuario
    const payload = this.jwtService.verify(token);
    return res.json({
      id: payload.sub,
      username: 'admin',
      email: 'admin@gmail.com',
    });
  }

  @Get('login')
  handleCallback(
    @Query('relayState') relayState: string,
    @Query('username') username: string,
    @Query('email') email: string,
    @Res() res: Response,
  ) {
    console.log('relayState Nest:', relayState);
    console.log('username:', username);
    console.log('email:', email);

    // 1) Armar el payload del token
    const payload = {
      username,
      email,
      // podés agregar más cosas si querés
      // role: 'admin',
    };

    // 2) Crear el token
    const token = this.jwtService.sign(payload, {
      // opcional si ya lo definiste en JwtModule
      expiresIn: '1d',
    });

    // 3) Setear cookie httpOnly con el token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false, // en prod: true (HTTPS)
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    // 4) Redirect a relayState (o fallback si viene vacío)
    const redirectUrl = relayState || 'http://localhost:5173/';
    return res.redirect(redirectUrl);
  }
}
