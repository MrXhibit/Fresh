import apiClient from '../../../lib/api-client';
import { MedicalRecord, CreateMedicalRecordDto } from './medical-record.types';

export class MedicalRecordService {
  static async createMedicalRecord(data: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const response = await apiClient.post('/medical-records', data);
    return response.data;
  }

  static async getMedicalRecords(): Promise<MedicalRecord[]> {
    const response = await apiClient.get('/medical-records');
    return response.data;
  }

  static async getMedicalRecord(id: string): Promise<MedicalRecord> {
    const response = await apiClient.get(`/medical-records/${id}`);
    return response.data;
  }

  static async updateMedicalRecord(id: string, data: Partial<CreateMedicalRecordDto>): Promise<MedicalRecord> {
    const response = await apiClient.patch(`/medical-records/${id}`, data);
    return response.data;
  }

  static async deleteMedicalRecord(id: string): Promise<void> {
    await apiClient.delete(`/medical-records/${id}`);
  }

  static async getPatientMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    const response = await apiClient.get(`/medical-records/patient/${patientId}`);
    return response.data;
  }
} 