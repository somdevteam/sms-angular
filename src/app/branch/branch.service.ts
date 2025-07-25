import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { AppDataService } from '@shared/app-data.service';
import { SnackbarService } from '@shared/snackbar.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService,
    private appDataService: AppDataService
  ) { }

  createBranch(payload: any) {
    return this.apiService.sendHttpPostRequest('/branch',payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          this.snackBar.successDialog('',message)
          return data;
         })
       );
   }

   getBranches() {
    return this.apiService.sendHttpGetRequest('/branch')
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   activateBranch(branchId:number) {
    return this.apiService.sendHttpGetRequest('/branch/activate/' + branchId)
       .pipe(
         map((resp) => {
          const { message, data } = resp;
          this.snackBar.successNotification(message);
          return data;
         })
       );
   }

   getAssignedAcademicByBranch(branchId:number) {
    return this.apiService.sendHttpGetRequest('/branch-academic/academicsByBranch/' + branchId)
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

  getBranchesByUser(branchId:number) {
    return this.apiService.sendHttpGetRequest('/branch/academicsByBranch/' + branchId)
      .pipe(
        map((resp) => {
          const { data } = resp;
          return data;
        })
      );
  }

   activeAndDeactivateBranchAcademic(payload: any) {
    return this.apiService.sendHttpPostRequest('/branch-academic/activate',payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          this.snackBar.successNotification(message)
          return data;
         })
       );
   }

}
