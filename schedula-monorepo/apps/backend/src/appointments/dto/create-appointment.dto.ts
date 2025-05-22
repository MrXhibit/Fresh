import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentType } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsEnum(AppointmentType)
  @IsNotEmpty()
  type: AppointmentType;

  @IsString()
  @IsOptional()
  notes?: string;
} 