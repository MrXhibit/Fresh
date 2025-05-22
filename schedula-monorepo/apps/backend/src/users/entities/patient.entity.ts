import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  insuranceInfo: string;

  @OneToOne(() => User, user => user.patient)
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, medicalRecord => medicalRecord.patient)
  medicalRecords: MedicalRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 