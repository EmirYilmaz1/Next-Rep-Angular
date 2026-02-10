import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutsService } from '../../services/workouts';
import { Workout } from '../../models/workout';

@Component({
  selector: 'app-workout-add-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './workout-add-dialog.html',
  styleUrl: './workout-add-dialog.scss'
})
export class WorkoutAddDialog {

  workout: Partial<Workout> = {
    name: '',
    description: '',
    type: 0,
    durationMinutes:0
  };

  saving = false;

  constructor(
    private dialogRef: MatDialogRef<WorkoutAddDialog>,
    private workoutsService: WorkoutsService
  ) {}

  save(): void {
    if (!this.workout.name || !this.workout.type) return;

    this.saving = true;
    this.workoutsService.newWorkout(this.workout as Workout).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Failed to create workout:', err);
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
