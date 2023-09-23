import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService:ApiService
  ) 
  { }

  getUsers() {
    return this.apiService.sendHttpGetRequest('/user')
       .pipe(
         map((user) => {
           return user;
         })
       );
   }

   getUsersFilter(payload:any) {
    return this.apiService.sendHttpPostRequest('/usersByFilter',payload)
       .pipe(
         map((user) => {
           return user;
         })
       );
   }

  saveUsers(payload:any): Observable<any> {
   return this.apiService.sendHttpPostRequest('/user',payload);
  }

  updateUsers(id:number,payload:any): Observable<any> {
    return this.apiService.sendHttpUpdateRequest('/user',id,payload);
   }

   getBranches() {
    return this.apiService.sendHttpGetRequest('/branch')
       .pipe(
         map((user) => {
           return user;
         })
       );
   }
}
