import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { SnackbarService } from '@shared/snackbar.service';
import { map, Observable } from 'rxjs';
import {UserOperation} from "./UserOperation";
import {AppDataService} from "@shared/app-data.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userOperation: UserOperation;
  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService,
    private appDataService: AppDataService,

  )
  {
    this.userOperation = this.appDataService.support_data['userOperation'] || null;
  }


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

   getBranches(param:string='') {
    return this.apiService.sendHttpGetRequest(`/branch/${param}`)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          return data;
         })
       );
   }

   resetPassword(id:number,payload:any): Observable<any> {
    return this.apiService.sendHttpUpdateRequest('/user/resetpassword',id,payload).pipe(
      map((resp) => {
        const { message,data } = resp;
        this.snackBar.successNotification(message)
        return data;
      }
      )
      );
   }
  setUserOperation(userOperation: UserOperation) {
    this.userOperation = userOperation;
    this.appDataService.set_support_data('userOperation', this.userOperation);
  }

  getUserOperation(): UserOperation {
    return this.userOperation;
  }

}
