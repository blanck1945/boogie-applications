import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ApplicationVisibility = 'PUBLIC' | 'AUTHENTICATED' | 'PRIVATE';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid') // 👈 Esto genera automáticamente un UUID v4
  id: string;

  @Column()
  appName: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  @Index()
  ownerId: string;

  @Index({ unique: true })
  @Column()
  url: string;

  // ✅ lo que definimos
  @Column({ type: 'text', default: 'PUBLIC' })
  visibility: ApplicationVisibility;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
