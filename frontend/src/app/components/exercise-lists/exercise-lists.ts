import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EXERCISES_MOCK, WORKOUTS_MOCK } from '../../mocks/MOCKS';
import { ExerciseDialog } from '../../dialogs/exercise-dialog/exercise-dialog';
import { ɵEmptyOutletComponent } from "@angular/router";
import { CdkNoDataRow } from "@angular/cdk/table";
import { WorkoutDialog } from '../../dialogs/workout-dialog/workout-dialog';
import { HttpClient } from '@angular/common/http';
import { Exercise } from '../../models/exercise';
import { ExerciseService } from '../../services/exercise';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';



@Component({
  selector: 'app-exercise-lists',
  imports: [NgFor, NgIf, NgComponentOutlet, NgTemplateOutlet],
  templateUrl: './exercise-lists.html',
  styleUrl: './exercise-lists.scss',
  standalone: true,

})

export class ExerciseListsComponent implements OnInit
{
  exercises: Exercise[] = [];
  user: User | null = null;
  private auth: AuthService;

 
    constructor(private dialog: MatDialog, private httpClient:HttpClient,private exerciseService:ExerciseService,  auth:AuthService)
    {
      httpClient.get('api/exercises').subscribe({next: (data:any) => this.exercises = data , error : (err) => console.log(err) }) 
      this.auth = auth;
    }

  ngOnInit(): void 
  {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;});
  }


  openDialog(exercise: any): void 
  {
    this.dialog.open(ExerciseDialog, {
      width: '500px',
      data: { row: exercise }
    });
  }

  deleteExercise(id:number):void
  {
    this.exerciseService.deleteExercises(id).subscribe({next: () => {
        this.exercises = this.exercises.filter(e => e.exercise_id !== id);
      },
      error: (err) => console.error('Failed to delete workout:', err)
    });
  }

  isInRole(roles: number[]) {
    return this.auth.isInRole(this.user, roles);
  }


}


