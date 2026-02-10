import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment';
import { Exercise } from '../models/exercise';


@Injectable({
  providedIn: 'root'
})
  

export class ExerciseService
{
  equipments:Exercise[] = [];

 constructor(private httpClient:HttpClient)
  {
    
  }

  getExercises(): Observable<Exercise[]> {
    return this.httpClient.get<Exercise[]>('api/exercises');
  }

  addExercises(body: Omit<Exercise, 'exercise_id'>) {
  return this.httpClient.post<Exercise>('api/exercises', body);
}



deleteExercises(id: number) 
{
  return this.httpClient.delete(`api/exercises/${id}`);
}

}
