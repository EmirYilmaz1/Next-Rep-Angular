import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { WorkoutsListComponent } from '../../components/workouts-list-component/workouts-list-component';
import { WorkoutDialog } from '../../dialogs/workout-dialog/workout-dialog';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user';
import { WorkoutAddDialog } from '../../dialogs/workout-add-dialog/workout-add-dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workouts-page',
  standalone: true,
  imports: [WorkoutsListComponent, MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './workouts-page.html',
  styleUrl: './workouts-page.scss'
})
export class WorkoutsPage implements OnInit {

  user: User | null = null;

  constructor(
    private dialog: MatDialog,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.whoami().subscribe({
      next: (u) => this.user = u,
      error: () => this.user = null
    });

    this.auth.currentUser$.subscribe(u => this.user = u);
  }

    isInRole(roles: number[]): boolean {
      return this.auth.isInRole(this.user, roles);
    }

    openAddDialog(): void {
    this.dialog.open(WorkoutAddDialog, {
      width: '520px',
      autoFocus: false,
      restoreFocus: false
    })
    .afterClosed()
    .subscribe((changed) => {
      if (changed) window.location.reload();
    });

 
  }
}
