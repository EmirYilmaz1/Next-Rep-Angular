import { Component, Injectable } from '@angular/core';
import { HistoryService } from '../../services/history';
import { ExerciseHistoryComponent } from '../../components/exercise-history/exercise-history';


@Component({
  selector: 'app-history-of-exercises',
  imports: [ExerciseHistoryComponent],
  templateUrl: './history-of-exercises.html',
  styleUrl: './history-of-exercises.scss'
})
export class HistoryOfExercises 
{
  
}
