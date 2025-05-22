export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  UNAVAILABLE = 'unavailable',
}

export interface Schedule {
  id: string;
  date: Date;
  time: string;
  status: TimeSlotStatus;
  doctor: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
} 