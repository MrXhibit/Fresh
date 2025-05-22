export interface MedicalRecord {
  id: string;
  date: Date;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  followUpDate?: Date;
  followUpNotes?: string;
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