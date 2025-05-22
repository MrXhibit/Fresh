import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule, TimeSlotStatus } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Doctor } from '../users/entities/doctor.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, doctorId: string) {
    const { date, timeSlots } = createScheduleDto;

    // Check if doctor exists
    const doctor = await this.doctorsRepository.findOne({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Create schedules for each time slot
    const schedules = timeSlots.map(time =>
      this.schedulesRepository.create({
        doctor,
        date,
        time,
        status: TimeSlotStatus.AVAILABLE,
      }),
    );

    return this.schedulesRepository.save(schedules);
  }

  async findAll(doctorId: string) {
    return this.schedulesRepository.find({
      where: { doctor: { id: doctorId } },
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async findAvailableSlots(doctorId: string, date: Date) {
    return this.schedulesRepository.find({
      where: {
        doctor: { id: doctorId },
        date,
        status: TimeSlotStatus.AVAILABLE,
      },
      order: { time: 'ASC' },
    });
  }

  async updateStatus(id: string, status: TimeSlotStatus, doctorId: string) {
    const schedule = await this.schedulesRepository.findOne({
      where: { id, doctor: { id: doctorId } },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    schedule.status = status;
    return this.schedulesRepository.save(schedule);
  }

  async markAsBooked(id: string, doctorId: string) {
    return this.updateStatus(id, TimeSlotStatus.BOOKED, doctorId);
  }

  async markAsUnavailable(id: string, doctorId: string) {
    return this.updateStatus(id, TimeSlotStatus.UNAVAILABLE, doctorId);
  }

  async markAsAvailable(id: string, doctorId: string) {
    return this.updateStatus(id, TimeSlotStatus.AVAILABLE, doctorId);
  }
} 