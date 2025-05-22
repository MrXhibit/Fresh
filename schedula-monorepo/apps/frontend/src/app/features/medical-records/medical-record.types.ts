export interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  followUpDate?: string;
  followUpNotes?: string;
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

export interface CreateMedicalRecordDto {
  patientId: string;
  date: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  followUpDate?: string;
  followUpNotes?: string;
} 