import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dev';

  @Get('me')
  getMe(@Req() req: Request) {
    // Leer la cookie "auth"
    const cookie = req.cookies?.auth;

    if (!cookie) {
      throw new UnauthorizedException('No auth cookie found');
    }

    let parsed: { token: string };

    try {
      parsed = JSON.parse(cookie);
    } catch (err) {
      throw new UnauthorizedException('Invalid auth cookie format');
    }

    if (!parsed.token) {
      throw new UnauthorizedException('Token missing in auth cookie');
    }

    try {
      const payload = jwt.verify(parsed.token, this.JWT_SECRET) as any;

      // Si se quiere, se responde con el payload real:
      return {
        id: payload.sub,
        username: payload.username,
        email: payload.email,
        role: 'superadmin', // extra si querés hardcodear
      };
    } catch (error) {
      console.error('JWT Error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
