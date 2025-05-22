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
  date: Date;
  time: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  doctor: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  patient: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
} 