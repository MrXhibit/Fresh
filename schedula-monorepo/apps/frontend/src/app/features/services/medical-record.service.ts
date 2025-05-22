import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../models/medical-record.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-records`;

  constructor(private http: HttpClient) {}

  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrl);
  }

  getMedicalRecord(id: string): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${id}`);
  }

  createMedicalRecord(record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.apiUrl, record);
  }

  updateMedicalRecord(id: string, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.patch<MedicalRecord>(`${this.apiUrl}/${id}`, record);
  }
} 