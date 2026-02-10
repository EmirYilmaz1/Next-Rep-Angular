import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateWorkOutHistoryPayload, WorkOutHistory } from '../models/workoutHistory';



@Injectable({
  providedIn: 'root'
})
  

export class HistoryService
{

 constructor(private httpClient:HttpClient)
  {
    
  }

  getHistory(): Observable<WorkOutHistory[]> {
    return this.httpClient.get<WorkOutHistory[]>('api/history');
  }

    addHistory(body: CreateWorkOutHistoryPayload): Observable<WorkOutHistory> {
    return this.httpClient.post<WorkOutHistory>('api/history', body);
  }


}
