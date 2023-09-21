import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService:ApiService
  ) 
  { }

  saveUsers(payload:any): Observable<any> {
   return this.apiService.sendHttpPostRequest('/user',payload);
  }

  updateUsers(id:number,payload:any): Observable<any> {
    return this.apiService.sendHttpUpdateRequest('/user',id,payload);
   }
}
