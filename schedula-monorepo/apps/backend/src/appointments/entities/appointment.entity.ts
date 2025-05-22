import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../users/entities/doctor.entity';
import { Patient } from '../../users/entities/patient.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  CHECKUP = 'checkup',
  EMERGENCY = 'emergency',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({
    type: 'enum',
    enum: AppointmentType,
  })
  type: AppointmentType;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  @JoinColumn()
  doctor: Doctor;

  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn()
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 