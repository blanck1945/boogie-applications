import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entity/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,
  ) {}

  findAll() {
    return this.applicationRepo.find();
  }

  findOne(id: number) {
    return this.applicationRepo.findOne({ where: { id } });
  }

  async create(data: Partial<Application>) {
    const app = this.applicationRepo.create(data);
    return this.applicationRepo.save(app);
  }

  async update(id: number, data: Partial<Application>) {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) {
      throw new NotFoundException('Application not found');
    }
    Object.assign(app, data);
    return this.applicationRepo.save(app);
  }

  async remove(id: number) {
    const app = await this.applicationRepo.findOne({ where: { id } });
    if (!app) {
      throw new NotFoundException('Application not found');
    }
    await this.applicationRepo.remove(app);
    return { deleted: true };
  }
}
