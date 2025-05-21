import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private usersService: UsersService,
  ) {}

  async create(createAppointmentDto: {
    doctorId: string;
    patientId: string;
    date: Date;
    startTime: string;
    endTime: string;
    notes?: string;
  }): Promise<Appointment> {
    const doctor = await this.usersService.findOne(createAppointmentDto.doctorId);
    const patient = await this.usersService.findOne(createAppointmentDto.patientId);

    // Check if the time slot is available
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        doctor: { id: doctor.id },
        appointmentDate: createAppointmentDto.date,
        startTime: createAppointmentDto.startTime,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    if (existingAppointment) {
      throw new ConflictException('This time slot is already booked');
    }

    const appointment = this.appointmentsRepository.create({
      doctor,
      patient,
      appointmentDate: createAppointmentDto.date,
      startTime: createAppointmentDto.startTime,
      endTime: createAppointmentDto.endTime,
      notes: createAppointmentDto.notes,
      status: AppointmentStatus.SCHEDULED,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['doctor', 'patient'],
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctor: { id: doctorId } },
      relations: ['patient'],
    });
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { patient: { id: patientId } },
      relations: ['doctor'],
    });
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentsRepository.save(appointment);
  }

  async getAvailableSlots(doctorId: string, date: Date): Promise<string[]> {
    const doctor = await this.usersService.findOne(doctorId);
    if (!doctor.availability) {
      throw new NotFoundException('Doctor availability not set');
    }

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.availability.days.includes(dayOfWeek)) {
      return [];
    }

    const bookedAppointments = await this.appointmentsRepository.find({
      where: {
        doctor: { id: doctorId },
        appointmentDate: date,
        status: AppointmentStatus.SCHEDULED,
      },
    });

    const bookedTimes = bookedAppointments.map((apt) => apt.startTime);
    const availableSlots = [];

    // Generate time slots between doctor's availability
    const startTime = new Date(`1970-01-01T${doctor.availability.startTime}`);
    const endTime = new Date(`1970-01-01T${doctor.availability.endTime}`);
    const slotDuration = 30; // 30 minutes per slot

    while (startTime < endTime) {
      const timeSlot = startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      if (!bookedTimes.includes(timeSlot)) {
        availableSlots.push(timeSlot);
      }

      startTime.setMinutes(startTime.getMinutes() + slotDuration);
    }

    return availableSlots;
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.save(appointment);
  }
} 