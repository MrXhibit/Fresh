import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordsRepository: Repository<MedicalRecord>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
  ) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto, doctorId: string) {
    const { patientId, date, diagnosis, prescription, notes, followUpDate, followUpNotes } = createMedicalRecordDto;

    // Check if doctor exists
    const doctor = await this.doctorsRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if patient exists
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Create medical record
    const medicalRecord = this.medicalRecordsRepository.create({
      doctor,
      patient,
      date,
      diagnosis,
      prescription,
      notes,
      followUpDate,
      followUpNotes,
    });

    return this.medicalRecordsRepository.save(medicalRecord);
  }

  async findAll(userId: string, userType: string) {
    const query = this.medicalRecordsRepository
      .createQueryBuilder('medicalRecord')
      .leftJoinAndSelect('medicalRecord.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('medicalRecord.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser');

    if (userType === 'doctor') {
      query.where('doctor.user.id = :userId', { userId });
    } else {
      query.where('patient.user.id = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string, userType: string) {
    const query = this.medicalRecordsRepository
      .createQueryBuilder('medicalRecord')
      .leftJoinAndSelect('medicalRecord.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('medicalRecord.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser')
      .where('medicalRecord.id = :id', { id });

    if (userType === 'doctor') {
      query.andWhere('doctor.user.id = :userId', { userId });
    } else {
      query.andWhere('patient.user.id = :userId', { userId });
    }

    const medicalRecord = await query.getOne();

    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }

    return medicalRecord;
  }

  async update(id: string, updateMedicalRecordDto: Partial<CreateMedicalRecordDto>, userId: string, userType: string) {
    const medicalRecord = await this.findOne(id, userId, userType);

    Object.assign(medicalRecord, updateMedicalRecordDto);
    return this.medicalRecordsRepository.save(medicalRecord);
  }
} 