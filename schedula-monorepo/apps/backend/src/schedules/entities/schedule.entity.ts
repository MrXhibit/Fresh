import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../users/entities/doctor.entity';

export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  UNAVAILABLE = 'unavailable',
}

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  time: string;

  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;

  @ManyToOne(() => Doctor, doctor => doctor.schedules)
  @JoinColumn()
  doctor: Doctor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 