import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { SnackbarService } from '@shared/snackbar.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService
  ) 
  { }

  getUsers() {
    return this.apiService.sendHttpGetRequest('/user')
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          return data;
         })
       );
   }

   getUsersFilter(payload:any) {
    return this.apiService.sendHttpPostRequest('/user/usersByFilter',payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          return data;
         })
       );
   }

  saveUsers(payload:any): Observable<any> {
   return this.apiService.sendHttpPostRequest('/user',payload).pipe(
    map((resp) => {
      const { message,data } = resp;
      this.snackBar.successNotification(message)
      return data;
    }
    )
   );
  }

  updateUsers(id:number,payload:any): Observable<any> {
    return this.apiService.sendHttpUpdateRequest('/user',id,payload).pipe(
      map((resp) => {
        const { message,data } = resp;
        this.snackBar.successNotification(message)
        return data;
      }
      )
      );
   }

   getBranches() {
    return this.apiService.sendHttpGetRequest('/branch')
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          return data;
         })
       );
   }
}
