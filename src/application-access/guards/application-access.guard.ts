// src/application-access/guards/application-access.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../../application/entity/application.entity';
import { ApplicationAccessService } from '../application-access.service';

@Injectable()
export class ApplicationAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    private readonly accessService: ApplicationAccessService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();

    // ajustá a tu auth real
    const user = (req as any).user;
    const userId = user?.id ? String(user.id) : null;

    const appIdRaw =
      (req.params as any).id ?? (req.params as any).applicationId;
    const applicationId = appIdRaw;

    if (!applicationId || Number.isNaN(applicationId)) {
      throw new NotFoundException('applicationId inválido');
    }

    const app = await this.appRepo.findOne({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application no existe');

    // 1) DENY corta todo
    if (userId) {
      const denied = await this.accessService.hasActiveEffect(
        applicationId,
        userId,
        'DENY',
      );
      if (denied) throw new ForbiddenException('No tenés acceso (blocked)');
    }

    // 2) PUBLIC
    if (app.visibility === 'PUBLIC') return true;

    // 3) AUTHENTICATED
    if (app.visibility === 'AUTHENTICATED') {
      if (!userId) throw new UnauthorizedException('Login requerido');
      return true;
    }

    // 4) PRIVATE => requiere ALLOW
    if (app.visibility === 'PRIVATE') {
      if (!userId) throw new UnauthorizedException('Login requerido');

      const allowed = await this.accessService.hasActiveEffect(
        applicationId,
        userId,
        'ALLOW',
      );
      if (!allowed)
        throw new ForbiddenException('No tenés invite para esta app');
      return true;
    }

    throw new ForbiddenException('Acceso denegado');
  }
}
