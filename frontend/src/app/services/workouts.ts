import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Workout } from "../models/workout";
import { Observable } from "rxjs";
import { Exercise } from "../models/exercise";
import { WorkoutE, WorkoutExercise } from "../models/workouts_exercises";

@Injectable({providedIn: 'root' })

export class WorkoutsService
{
    private apiUrl = '/api/workouts'

    constructor(private httpClient: HttpClient){}

    getWorkout():Observable<Workout>
    {
       return this.httpClient.get<Workout>(this.apiUrl);
    }

    newWorkout(workout:Workout):Observable<Workout>
    {
        return this.httpClient.post<Workout>(this.apiUrl, workout);
    }

    deleteWorkout(id:number)
    {
        return this.httpClient.delete( `${this.apiUrl}/${id}`)
    }

    getExercises(id:number):Observable<WorkoutE>
    {
        return this.httpClient.get<WorkoutE>(`${this.apiUrl}/${id}`)
    }
}