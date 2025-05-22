import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/status`, { status });
  }

  cancelAppointment(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  completeAppointment(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/complete`, {});
  }
} 