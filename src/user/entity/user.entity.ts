import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // 👈 CAMBIO 1: Forzamos el nombre plural 'users'
export class User {
  @PrimaryGeneratedColumn() // 👈 CAMBIO 2: Quitamos 'uuid' porque en tu DB es un número (serial)
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  // CAMBIO 3: Agregamos las columnas que veo en tu captura de pantalla
  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string | null;

  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', select: false }) // Por seguridad no traemos el password en selects
  password: string;

  @Column({ type: 'varchar', default: 'admin' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  // Si quieres conservar 'username' y 'roles' pero no están en la captura, 
  // asegúrate de que existan en la DB o ponlos como opcionales.
  @Column({ type: 'varchar', nullable: true })
  username: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}