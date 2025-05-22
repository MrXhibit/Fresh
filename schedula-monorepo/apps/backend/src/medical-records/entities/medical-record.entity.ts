import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../users/entities/doctor.entity';
import { Patient } from '../../users/entities/patient.entity';

@Entity()
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  diagnosis: string;

  @Column({ nullable: true })
  prescription: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  followUpDate: Date;

  @Column({ nullable: true })
  followUpNotes: string;

  @ManyToOne(() => Doctor, doctor => doctor.medicalRecords)
  @JoinColumn()
  doctor: Doctor;

  @ManyToOne(() => Patient, patient => patient.medicalRecords)
  @JoinColumn()
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 