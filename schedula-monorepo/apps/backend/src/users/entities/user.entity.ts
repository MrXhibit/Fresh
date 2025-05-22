import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

export enum UserType {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
  })
  userType: UserType;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;

  @OneToOne(() => Doctor, doctor => doctor.user, { nullable: true })
  doctor: Doctor;

  @OneToOne(() => Patient, patient => patient.user, { nullable: true })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 