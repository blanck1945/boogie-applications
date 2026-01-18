// src/application-access/application-access.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationAccessDto } from './dto/create-application-access.dto';
import { UpdateApplicationAccessDto } from './dto/update-application-access.dto';
import { ApplicationAccess } from './entity/application-access.entity';
import { Application } from 'src/application/entity/application.entity';

@Injectable()
export class ApplicationAccessService {
  constructor(
    @InjectRepository(ApplicationAccess)
    private readonly accessRepo: Repository<ApplicationAccess>,

    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  async hasActiveEffect(
    applicationId: string,
    userId: string,
    effect: 'ALLOW' | 'DENY',
  ): Promise<boolean> {
    const row = await this.accessRepo.findOne({
      where: {
        application: { id: applicationId },
        userId,
        effect,
        isActive: true,
      },
      select: {
        id: true,
      },
      relations: {
        application: true, // opcional; generalmente NO hace falta para el where anidado
      },
    });

    return !!row;
  }

  async listByApplication(appId: string) {
    const exists = await this.appRepo.exist({ where: { id: appId } });
    if (!exists) throw new NotFoundException('Application no encontrada');

    return this.accessRepo.find({
      where: { application: { id: appId } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Stage 1: un override por (appId, userId)
   * Si ya existe, actualiza (upsert lógico).
   */
  async upsert(appId: string, dto: CreateApplicationAccessDto) {
    const app = await this.appRepo.findOne({ where: { id: appId } });
    if (!app) throw new NotFoundException('Application no encontrada');

    const userId = (dto.userId ?? '').trim();
    if (!userId) throw new ConflictException('userId no puede estar vacío');

    const existing = await this.accessRepo.findOne({
      where: { application: { id: appId }, userId },
    });

    const effect = dto.effect ?? 'ALLOW';
    const role = dto.role ?? 'VIEWER';
    const isActive = dto.isActive ?? true;

    if (existing) {
      existing.effect = effect;
      existing.role = role;
      existing.isActive = isActive;
      return this.accessRepo.save(existing);
    }

    const entity = this.accessRepo.create({
      application: app,
      userId,
      effect,
      role,
      isActive,
    });

    try {
      return await this.accessRepo.save(entity);
    } catch (e: any) {
      // por si hay carrera y dispara unique constraint
      if (e?.code === '23505') {
        throw new ConflictException(
          'Ya existe access para ese userId en esta app',
        );
      }
      throw e;
    }
  }

  async update(
    appId: string,
    accessId: string,
    dto: UpdateApplicationAccessDto,
  ) {
    const found = await this.accessRepo.findOne({
      where: { application: { id: appId } },
    });
    if (!found) throw new NotFoundException('Access no encontrado');

    if (dto.effect !== undefined) found.effect = dto.effect;
    if (dto.role !== undefined) found.role = dto.role;
    if (dto.isActive !== undefined) found.isActive = dto.isActive;

    return this.accessRepo.save(found);
  }

  async remove(appId: string, accessId: string) {
    const found = await this.accessRepo.findOne({
      where: { id: accessId, application: { id: appId } },
    });
    if (!found) throw new NotFoundException('Access no encontrado');

    await this.accessRepo.remove(found);
    return { ok: true };
  }
}
