import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  timeSlots: string[];
} 