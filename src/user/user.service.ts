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
      select: ['id', 'email', 'name', 'lastName', 'username', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new BadRequestException('El email ya existe');

    const user = this.repo.create({
      email,
      password: dto.password,
      name: dto.name?.trim(),
      lastName: dto.lastName?.trim(),
      username: dto.username?.trim(),
      role: dto.role ?? 'admin',
      isActive: dto.isActive ?? true,
    });

    const savedUser = await this.repo.save(user);
    
    // Retornar sin password
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll(q?: string) {
    if (!q?.trim()) {
      return this.repo.find({ 
        order: { createdAt: 'DESC' },
        select: ['id', 'email', 'name', 'lastName', 'username', 'role', 'isActive', 'createdAt', 'updatedAt'],
      });
    }

    const query = q.trim();
    return this.repo.find({
      where: [
        { email: ILike(`%${query}%`) },
        { username: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) },
        { lastName: ILike(`%${query}%`) },
      ],
      order: { createdAt: 'DESC' },
      select: ['id', 'email', 'name', 'lastName', 'username', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ 
      where: { id },
      select: ['id', 'email', 'name', 'lastName', 'username', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new NotFoundException('User no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User no encontrado');

    if (dto.email) user.email = dto.email.trim().toLowerCase();
    if (dto.password) user.password = dto.password;
    if (dto.name !== undefined) user.name = dto.name?.trim() || null;
    if (dto.lastName !== undefined) user.lastName = dto.lastName?.trim() || null;
    if (dto.username !== undefined) user.username = dto.username?.trim() || null;
    if (dto.role) user.role = dto.role.trim();
    if (dto.isActive !== undefined) user.isActive = dto.isActive;

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User no encontrado');
    await this.repo.remove(user);
    return { ok: true };
  }
}
