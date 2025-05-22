import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from '../../models/schedule.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TimeSlotStatus } from '../../models/schedule.model';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">My Schedule</h2>
        <button mat-raised-button color="primary" (click)="openAddScheduleDialog()">
          Add Schedule
        </button>
      </div>
      
      <table mat-table [dataSource]="schedules" class="w-full">
        <!-- Date Column -->
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let schedule">{{schedule.date | date}}</td>
        </ng-container>

        <!-- Time Column -->
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Time</th>
          <td mat-cell *matCellDef="let schedule">{{schedule.time}}</td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let schedule">
            <span [ngClass]="{
              'bg-green-100 text-green-800': schedule.status === 'available',
              'bg-blue-100 text-blue-800': schedule.status === 'booked',
              'bg-red-100 text-red-800': schedule.status === 'unavailable'
            }" class="px-2 py-1 rounded-full text-sm">
              {{schedule.status}}
            </span>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let schedule">
            <button mat-icon-button color="primary" (click)="markAsAvailable(schedule)" 
                    *ngIf="schedule.status !== 'available'">
              <mat-icon>check_circle</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="markAsUnavailable(schedule)"
                    *ngIf="schedule.status !== 'unavailable'">
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
export class ScheduleListComponent implements OnInit {
  schedules: Schedule[] = [];
  displayedColumns: string[] = ['date', 'time', 'status', 'actions'];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
      }
    });
  }

  openAddScheduleDialog(): void {
    // TODO: Implement add schedule dialog
  }

  markAsAvailable(schedule: Schedule): void {
    this.scheduleService.markAsAvailable(schedule.id).subscribe({
      next: () => {
        this.loadSchedules();
      },
      error: (error) => {
        console.error('Error updating schedule:', error);
      }
    });
  }

  markAsUnavailable(schedule: Schedule): void {
    this.scheduleService.markAsUnavailable(schedule.id).subscribe({
      next: () => {
        this.loadSchedules();
      },
      error: (error) => {
        console.error('Error updating schedule:', error);
      }
    });
  }
} 