import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Workout } from '../../models/workout';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WorkoutDialog } from '../../dialogs/workout-dialog/workout-dialog';
import { CdkNoDataRow } from "@angular/cdk/table";
import { WorkoutsService } from '../../services/workouts';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';




@Component({
  selector: 'app-workouts-list',
  imports: [CommonModule, CdkNoDataRow],
  templateUrl: './workouts-list-component.html',
  styleUrl: './workouts-list-component.scss',
  providers:[WorkoutsService]
})

export class WorkoutsListComponent implements OnInit
{
  user: User | null = null;
  public auth: AuthService;
  workouts:Workout[] = [];
  constructor(private httpClient:HttpClient ,private dialog:MatDialog , private workoutsService: WorkoutsService,  auth:AuthService,)
  {
    this.auth = auth;
  };

  ngOnInit(): void 
  {
    this.getWorkouts();
    this.auth.currentUser$.subscribe(user => {
      this.user = user;});
  }


   getWorkouts(): void {
    this.workoutsService.getWorkout().subscribe({
      next: (data:any) => 
      {
        this.workouts = data;
      },
      error: (err) => console.error('Failed to load workouts:', err)
    });
  }

  openWorkoutDialog(workout: Workout): void {
    this.dialog.open(WorkoutDialog, {
      width: '600px',
      data: { id: workout.workout_id}
    });
  }

  deleteWorkout(id: number): void 
  {
    this.workoutsService.deleteWorkout(id).subscribe({
      next: () => {
        this.workouts = this.workouts.filter(w => w.workout_id !== id);
      },
      error: (err) => console.error('Failed to delete workout:', err)
    });
  }

    isInRole(roles: number[]) {
    return this.auth.isInRole(this.user, roles);
  }
}

