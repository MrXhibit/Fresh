export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  CHECKUP = 'checkup',
  EMERGENCY = 'emergency',
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
  notes?: string;
} 