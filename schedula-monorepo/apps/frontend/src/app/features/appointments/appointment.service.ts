import apiClient from '../../../lib/api-client';
import { Appointment, CreateAppointmentDto } from './appointment.types';

export class AppointmentService {
  static async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  }

  static async getAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get('/appointments');
    return response.data;
  }

  static async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  }

  static async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }

  static async cancelAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/cancel`);
    return response.data;
  }

  static async completeAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.patch(`/appointments/${id}/complete`);
    return response.data;
  }
} 