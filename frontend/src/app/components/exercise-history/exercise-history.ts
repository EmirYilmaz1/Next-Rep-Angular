import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../../services/history';
import { CommonModule } from '@angular/common';
import { WorkOutHistory } from '../../models/workoutHistory';


@Component({
  selector: 'app-exercise-history',
  imports: [CommonModule],
  templateUrl: './exercise-history.html',
  styleUrl: './exercise-history.scss'
})

export class ExerciseHistoryComponent 
{
  histories:WorkOutHistory[] = [];
  constructor(private historyservice:HistoryService)
  {
    historyservice.getHistory().subscribe({next:(data:any)=>this.histories = data , error:(err:any)=>console.log(err)})
  }

  
  loadEquipments() {
  this.historyservice.getHistory().subscribe({
    next: (data:any) => this.histories = data,
    error: err => console.log(err)
  });

  }
}

