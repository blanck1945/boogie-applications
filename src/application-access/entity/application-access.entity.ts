import { Application } from '../../application/entity/application.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

// Stage 1: deny/allow por usuario
export type AccessEffect = 'ALLOW' | 'DENY';

// opcional: permisos simples por usuario
export type AppAccessRole = 'VIEWER' | 'EDITOR' | 'ADMIN';

@Entity()
@Unique(['application', 'userId']) // un override por usuario y app
export class ApplicationAccess {
  @PrimaryGeneratedColumn('uuid') // 👈 Esto genera automáticamente un UUID v4
  id: string;

  @Index()
  @ManyToOne(() => Application, { onDelete: 'CASCADE', nullable: false })
  application: Application;

  // Para Stage 1 usamos userId como number/string sin FK todavía
  // (cuando tengas User entity, lo cambiamos a ManyToOne(User)).
  @Index()
  @Column()
  userId: string;

  @Column({ type: 'text', default: 'ALLOW' })
  effect: AccessEffect;

  @Column({ type: 'text', default: 'VIEWER' })
  role: AppAccessRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
