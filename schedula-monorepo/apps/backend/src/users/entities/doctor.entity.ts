import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  specialization: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  experience: string;

  @OneToOne(() => User, user => user.doctor)
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => Schedule, schedule => schedule.doctor)
  schedules: Schedule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 