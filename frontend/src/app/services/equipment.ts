import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../models/equipment';


@Injectable({
  providedIn: 'root'
})
  

export class EquipmentService
{
  equipments:Equipment[] = [];

 constructor(private httpClient:HttpClient)
  {
    
  }

    getEquipments(): Observable<Equipment[]> {
    return this.httpClient.get<Equipment[]>('api/equipment');
  }

  addEquipment(eq: Equipment) {
  return this.httpClient.post<Equipment>('api/equipment', eq);
}

updateEquipment(eq: Equipment) 
{
  return this.httpClient.put<Equipment>(`api/equipment/${eq.equipment_id}`, eq);
}

deleteEquipment(id: number) 
{
  return this.httpClient.delete(`api/equipment/${id}`);
}

}
