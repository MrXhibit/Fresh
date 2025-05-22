import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  getSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.apiUrl);
  }

  getAvailableSlots(doctorId: string, date: Date): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/available`, {
      params: {
        doctorId,
        date: date.toISOString().split('T')[0]
      }
    });
  }

  createSchedule(schedule: Partial<Schedule>): Observable<Schedule[]> {
    return this.http.post<Schedule[]>(this.apiUrl, schedule);
  }

  updateStatus(id: string, status: string): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${id}/status`, { status });
  }

  markAsAvailable(id: string): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${id}/available`, {});
  }

  markAsUnavailable(id: string): Observable<Schedule> {
    return this.http.patch<Schedule>(`${this.apiUrl}/${id}/unavailable`, {});
  }
} 