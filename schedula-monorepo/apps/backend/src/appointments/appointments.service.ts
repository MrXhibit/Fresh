import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private mailService: MailService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, patientId: string) {
    const { doctorId, date, time, type, notes } = createAppointmentDto;

    // Check if doctor exists
    const doctor = await this.doctorsRepository.findOne({
      where: { id: doctorId },
      relations: ['user'],
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if patient exists
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
      relations: ['user'],
    });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if time slot is available
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        doctor: { id: doctorId },
        date,
        time,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    if (existingAppointment) {
      throw new BadRequestException('Time slot is not available');
    }

    // Create appointment
    const appointment = this.appointmentsRepository.create({
      doctor,
      patient,
      date,
      time,
      type,
      notes,
      status: AppointmentStatus.SCHEDULED,
    });

    await this.appointmentsRepository.save(appointment);

    // Send confirmation email
    await this.mailService.sendAppointmentConfirmation(patient.user.email, {
      date: date.toISOString().split('T')[0],
      time,
      doctorName: `${doctor.user.firstName} ${doctor.user.lastName}`,
      type,
    });

    return appointment;
  }

  async findAll(userId: string, userType: string) {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser');

    if (userType === 'doctor') {
      query.where('doctor.user.id = :userId', { userId });
    } else {
      query.where('patient.user.id = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string, userType: string) {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser')
      .where('appointment.id = :id', { id });

    if (userType === 'doctor') {
      query.andWhere('doctor.user.id = :userId', { userId });
    } else {
      query.andWhere('patient.user.id = :userId', { userId });
    }

    const appointment = await query.getOne();

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async updateStatus(id: string, status: AppointmentStatus, userId: string, userType: string) {
    const appointment = await this.findOne(id, userId, userType);

    appointment.status = status;
    await this.appointmentsRepository.save(appointment);

    // Send reminder email if status is scheduled
    if (status === AppointmentStatus.SCHEDULED) {
      await this.mailService.sendAppointmentReminder(appointment.patient.user.email, {
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        doctorName: `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
        type: appointment.type,
      });
    }

    return appointment;
  }

  async cancel(id: string, userId: string, userType: string) {
    return this.updateStatus(id, AppointmentStatus.CANCELLED, userId, userType);
  }

  async complete(id: string, userId: string, userType: string) {
    return this.updateStatus(id, AppointmentStatus.COMPLETED, userId, userType);
  }
} 