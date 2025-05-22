import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { AppointmentStatus } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">My Appointments</h2>
      
      <table mat-table [dataSource]="appointments" class="w-full">
        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.date | date}}</td>
        </ng-container>

        <!-- Time Column -->
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Time</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.time}}</td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let appointment">{{appointment.type}}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let appointment">
            <span [ngClass]="{
              'bg-yellow-100 text-yellow-800': appointment.status === 'scheduled',
              'bg-green-100 text-green-800': appointment.status === 'completed',
              'bg-red-100 text-red-800': appointment.status === 'cancelled'
            }" class="px-2 py-1 rounded-full text-sm">
              {{appointment.status}}
            </span>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let appointment">
            <button mat-icon-button color="primary" (click)="viewAppointment(appointment)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="cancelAppointment(appointment)" 
                    *ngIf="appointment.status === 'scheduled'">
              <mat-icon>cancel</mat-icon>
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
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  displayedColumns: string[] = ['date', 'time', 'type', 'status', 'actions'];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
      }
    });
  }

  viewAppointment(appointment: Appointment): void {
    // TODO: Implement view appointment details
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
        }
      });
    }
  }
} 