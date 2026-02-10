import { Component, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ExerciseFormComponent } from '../exercise-form/exercise-form';
import { ExerciseService } from '../../services/exercise';

@Component({
  selector: 'app-add-exercise',
  standalone: true,
  imports: [MatDialogModule, ExerciseFormComponent],
  templateUrl: './add-exercise.html'
})
export class AddExerciseDialog {

  @ViewChild(ExerciseFormComponent)
  exerciseForm!: ExerciseFormComponent;

  constructor(
    public dialogRef: MatDialogRef<AddExerciseDialog>,
    private snackBar: MatSnackBar,
    private exerciseService: ExerciseService
  ) {}

  onSave() {
    if (!this.exerciseForm.form.valid) return;

    const payload = this.exerciseForm.getPayload();

    this.exerciseService.addExercises(payload).subscribe({
      next: ex => {
        this.snackBar.open('Exercise added', 'Close', { duration: 3000 });
        this.dialogRef.close(ex);
      },
      error: err => {
        this.snackBar.open(err?.error?.message ?? 'Error', 'Close');
      }
    });
  }
}
