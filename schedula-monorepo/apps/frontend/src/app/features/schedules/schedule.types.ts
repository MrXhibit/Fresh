export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface Schedule {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
} 