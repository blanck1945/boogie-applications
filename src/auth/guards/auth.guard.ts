// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Obtenemos el token del header Authorization Bearer
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_TOKEN_SECRET, // La misma que usaste para firmar
      });

      console.warn('payload', payload);

      // Insertamos el payload (sub, email, roles) en el request
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }
}
