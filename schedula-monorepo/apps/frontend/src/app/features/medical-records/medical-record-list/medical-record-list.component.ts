import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalRecordService } from '../../services/medical-record.service';
import { MedicalRecord } from '../../models/medical-record.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-medical-record-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Medical Records</h2>
        <button mat-raised-button color="primary" (click)="openAddRecordDialog()">
          Add Record
        </button>
      </div>
      
      <table mat-table [dataSource]="medicalRecords" class="w-full">
        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let record">{{record.date | date}}</td>
        </ng-container>

        <!-- Diagnosis Column -->
        <ng-container matColumnDef="diagnosis">
          <th mat-header-cell *matHeaderCellDef>Diagnosis</th>
          <td mat-cell *matCellDef="let record">{{record.diagnosis}}</td>
        </ng-container>

        <!-- Doctor Column -->
        <ng-container matColumnDef="doctor">
          <th mat-header-cell *matHeaderCellDef>Doctor</th>
          <td mat-cell *matCellDef="let record">
            {{record.doctor.user.firstName}} {{record.doctor.user.lastName}}
          </td>
        </ng-container>

        <!-- Follow-up Date Column -->
        <ng-container matColumnDef="followUpDate">
          <th mat-header-cell *matHeaderCellDef>Follow-up Date</th>
          <td mat-cell *matCellDef="let record">
            {{record.followUpDate | date}}
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let record">
            <button mat-icon-button color="primary" (click)="viewRecord(record)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="accent" (click)="editRecord(record)">
              <mat-icon>edit</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class MedicalRecordListComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  displayedColumns: string[] = ['date', 'diagnosis', 'doctor', 'followUpDate', 'actions'];

  constructor(private medicalRecordService: MedicalRecordService) {}

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  loadMedicalRecords(): void {
    this.medicalRecordService.getMedicalRecords().subscribe({
      next: (records) => {
        this.medicalRecords = records;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
      }
    });
  }

  openAddRecordDialog(): void {
    // TODO: Implement add record dialog
  }

  viewRecord(record: MedicalRecord): void {
    // TODO: Implement view record details
  }

  editRecord(record: MedicalRecord): void {
    // TODO: Implement edit record dialog
  }
} 