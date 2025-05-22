import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsBoolean } from 'class-validator';
import { DayOfWeek } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @ApiProperty({
    enum: DayOfWeek,
    description: 'The day of the week for the schedule',
    example: DayOfWeek.MONDAY
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    description: 'Start time of the schedule in HH:mm format',
    example: '09:00'
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the schedule in HH:mm format',
    example: '17:00'
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Whether the schedule is available for appointments',
    default: true,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Start time of the break in HH:mm format',
    example: '12:00',
    required: false
  })
  @IsOptional()
  @IsString()
  breakStartTime?: string;

  @ApiProperty({
    description: 'End time of the break in HH:mm format',
    example: '13:00',
    required: false
  })
  @IsOptional()
  @IsString()
  breakEndTime?: string;
} 