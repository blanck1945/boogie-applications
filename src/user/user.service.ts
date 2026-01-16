// src/user/user.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('El email ya existe');

    const user = this.repo.create({
      email,
      username: dto.username.trim(),
      isActive: dto.isActive ?? true,
      roles: dto.roles?.map((r) => r.trim()).filter(Boolean) ?? [],
    });

    return this.repo.save(user);
  }

  async findAll(q?: string) {
    if (!q?.trim()) {
      return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    const query = q.trim();
    return this.repo.find({
      where: [
        { email: ILike(`%${query}%`) },
        { username: ILike(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User no encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.email) user.email = dto.email.trim().toLowerCase();
    if (dto.username) user.username = dto.username.trim();
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.roles) user.roles = dto.roles.map((r) => r.trim()).filter(Boolean);

    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { ok: true };
  }
}
