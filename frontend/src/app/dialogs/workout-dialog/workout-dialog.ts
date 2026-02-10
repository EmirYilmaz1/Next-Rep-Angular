import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ExerciseDialog } from '../exercise-dialog/exercise-dialog';
import { CommonModule } from '@angular/common';
import { WorkoutE } from '../../models/workouts_exercises';
import { WorkoutsService } from '../../services/workouts';
import { Workout } from '../../models/workout';
import { WorkoutDataDialog } from '../workout-data-dialog/workout-data-dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-workout-dialog',
  templateUrl: './workout-dialog.html',
  styleUrls: ['./workout-dialog.scss'],
  imports: [CommonModule]
})
export class WorkoutDialog implements OnInit
{
  
  public workout_e!:WorkoutE;
  
  constructor( private dialogRef:DialogRef,
     @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private dialog: MatDialog,  @Inject(WorkoutsService) private workoutsService: WorkoutsService
  ) 
  {
    this.workoutsService.getExercises(this.data.id).subscribe({next: (d:WorkoutE) => this.workout_e= d , error:(e:any) => console.log(e)});
    
  }

  ngOnInit(): void 
  {
      console.log(this.data.id);

    this.workoutsService.getExercises(this.data.id).subscribe({next: (d:WorkoutE) => this.workout_e= d , error:(e:any) => console.log(e)});
  }

  openWorkoutDataDialog(workout:Workout):void
  {
      this.dialog.open(WorkoutDataDialog, {width: '1000px', data: { id:workout.workout_id}});
  }

  openExerciseDialog(exercise: any) {
    this.dialog.open(ExerciseDialog, {
      width: '500px',
      data: { row: exercise }
    });
  }

  close(): void {
  this.dialogRef.close();
}
}
