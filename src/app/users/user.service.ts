import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService:ApiService
  ) 
  { }

  saveUsers(payload:any) {
   return this.apiService.sendHttpPostRequest('/user',payload);
  }
}
