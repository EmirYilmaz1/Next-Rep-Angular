import { Component, OnInit } from '@angular/core';
import { ExerciseListsComponent } from "../../components/exercise-lists/exercise-lists";
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ExerciseDialog } from '../../dialogs/exercise-dialog/exercise-dialog';
import { AddExerciseDialog } from '../../components/add-exercise/add-exercise';


@Component({
  selector: 'app-exercises',
  imports: [ExerciseListsComponent, CommonModule,  MatDialogModule, MatButtonModule],
  templateUrl: './exercises.html',
  styleUrl: './exercises.scss'
})
export class ExercisesPage implements OnInit
{
  private auth:AuthService;
  user: User | null = null;
  constructor(auth:AuthService, private dialog:MatDialog) 
  {
    this.auth = auth;  
  }

  ngOnInit(): void 
  {
    this.auth.currentUser$.subscribe(user => {
    this.user = user;});
  }


    isInRole(roles: number[]) {
    return this.auth.isInRole(this.user, roles);
  }

  openAddExercise() {
  const ref = this.dialog.open(AddExerciseDialog, { width: '600px' });

  ref.afterClosed().subscribe(result => {

  });
}


  
}
