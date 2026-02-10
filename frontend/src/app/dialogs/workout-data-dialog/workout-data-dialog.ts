import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ExerciseDialog } from '../exercise-dialog/exercise-dialog';
import { CommonModule } from '@angular/common';
import { WorkoutE } from '../../models/workouts_exercises';
import { WorkoutsService } from '../../services/workouts';
import { Workout } from '../../models/workout';
import { WorkoutDataForm } from '../../components/workout-data-form/workout-data-form';
import { HistoryService } from '../../services/history';
import { DialogRef } from '@angular/cdk/dialog';



@Component({
  selector: 'app-workout-data-dialog',
  imports: [WorkoutDataForm],
  templateUrl: './workout-data-dialog.html',
  styleUrl: './workout-data-dialog.scss'
})
export class WorkoutDataDialog 
{

   public workout_e!:WorkoutE;
  
  constructor(private historyService:HistoryService, private dialogRef:DialogRef,
     @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialog: MatDialog,  @Inject(WorkoutsService) private workoutsService: WorkoutsService
  ) 
  {
    this.workoutsService.getExercises(this.data.id).subscribe({next: (d:WorkoutE) => this.workout_e= d , error:(e:any) => console.log(e)});
  }

onSubmit(formComp: any) {
  console.log('CLICK OK');              // 1) bunu görmen lazım
  console.log('formComp:', formComp);   // 2) undefined olmamalı

  const payload = formComp.getPayload();
  console.log('payload:', payload);     // 3) payload dolu olmalı

  // form valid kontrolü (istersen)
  if (formComp.form && formComp.form.invalid) {
    console.warn('FORM INVALID');
    formComp.form.markAllAsTouched?.();
    return;
  }

  this.historyService.addHistory(payload).subscribe({
    next: (res) => {
      console.log('SUCCESS:', res);
      this.dialogRef.close(true);
    },
    error: (err) => {
      console.error('ERROR:', err);
    }
  });
}

}
