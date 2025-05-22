import apiClient from '../../../lib/api-client';
import { Schedule, CreateScheduleDto } from './schedule.types';

export class ScheduleService {
  static async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
    const response = await apiClient.post('/schedules', data);
    return response.data;
  }

  static async getSchedules(): Promise<Schedule[]> {
    const response = await apiClient.get('/schedules');
    return response.data;
  }

  static async getSchedule(id: string): Promise<Schedule> {
    const response = await apiClient.get(`/schedules/${id}`);
    return response.data;
  }

  static async updateSchedule(id: string, data: Partial<CreateScheduleDto>): Promise<Schedule> {
    const response = await apiClient.patch(`/schedules/${id}`, data);
    return response.data;
  }

  static async deleteSchedule(id: string): Promise<void> {
    await apiClient.delete(`/schedules/${id}`);
  }

  static async getDoctorSchedules(doctorId: string): Promise<Schedule[]> {
    const response = await apiClient.get(`/schedules/doctor/${doctorId}`);
    return response.data;
  }
} 