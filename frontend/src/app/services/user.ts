import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { Person } from "../models/person";

@Injectable({providedIn: 'root' })

export class UserSevice
{
    private apiUrl = '/api/users/profile'

    constructor(private httpClient: HttpClient){}

    getProfile():Observable<Person>
    {
       return this.httpClient.get<Person>(this.apiUrl);
    }

   updateProfile(payload: Partial<Person>): Observable<Person> 
   {
      return this.httpClient.put<Person>(this.apiUrl, payload);
   }
   
   updateUserRole(userId: number, body: { ROLE_role_id: number }) {
  return this.httpClient.put(`/api/users/${userId}/role`, body);
}


getUsers(): Observable<Person[]> {
  return this.httpClient.get<Person[]>(`/api/users?_=${Date.now()}`);
}

}