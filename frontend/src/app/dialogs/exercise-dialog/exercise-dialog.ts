import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exercise-dialog',
  templateUrl: './exercise-dialog.html',
  styleUrls: ['./exercise-dialog.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton
  ]
})
export class ExerciseDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { row: any }
  ) {}
}
