import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entity/application.entity';
import { ApplicationAccess } from '../application-access/entity/application-access.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  findAll() {
    return this.applicationRepo.find();
  }

  // applications.service.ts
  async findAllByOwner(
    ownerId: string,
    sortBy: 'id' | 'name' | 'createdAt' = 'id',
  ) {
    const orderBy: Record<string, 'ASC' | 'DESC'> = {};
    
    switch (sortBy) {
      case 'id':
        orderBy.id = 'ASC';
        break;
      case 'name':
        orderBy.appName = 'ASC';
        break;
      case 'createdAt':
        orderBy.createdAt = 'DESC';
        break;
    }

    return await this.applicationRepo.find({
      where: { ownerId },
      order: orderBy,
    });
  }

  /**
   * Stage 1: listado visible para un usuario.
   * - Sin user => solo PUBLIC
   * - Con user => PUBLIC + AUTHENTICATED + PRIVATE si ALLOW
   * - DENY excluye siempre
   */
  async findVisibleForUser(
    userId?: string | null,
    sortBy: 'id' | 'name' | 'createdAt' = 'id',
  ) {
    const qb = this.applicationRepo
      .createQueryBuilder('app')
      .where('app.isActive = true');

    // anon => solo PUBLIC
    if (!userId) {
      qb.andWhere("app.visibility = 'PUBLIC'");
    } else {
      // join solo para este user, y solo rows activas
      qb.leftJoin(
        ApplicationAccess,
        'aa',
        'aa.applicationId = app.id AND aa.userId = :userId AND aa.isActive = true',
        { userId },
      );

      // 1) DENY excluye siempre
      qb.andWhere("(aa.effect IS NULL OR aa.effect != 'DENY')");

      // 2) visibilidades permitidas
      qb.andWhere(`
        (
          app.visibility IN ('PUBLIC','AUTHENTICATED')
          OR (app.visibility = 'PRIVATE' AND aa.effect = 'ALLOW')
        )
      `);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'id':
        qb.orderBy('app.id', 'ASC');
        break;
      case 'name':
        qb.orderBy('app.appName', 'ASC');
        break;
      case 'createdAt':
        qb.orderBy('app.createdAt', 'DESC');
        break;
    }

    return qb.getMany();
  }

  findOne(id: string) {
    return this.applicationRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Application>) {
    const app = this.applicationRepo.create(data);
    return this.applicationRepo.save(app);
  }

  async update(id: string, data: Partial<Application>) {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    Object.assign(app, data);
    return this.applicationRepo.save(app);
  }

  async remove(id: string) {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    await this.applicationRepo.remove(app);
    return { deleted: true };
  }
}
