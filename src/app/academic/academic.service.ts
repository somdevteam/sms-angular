import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { AppDataService } from '@shared/app-data.service';
import { SnackbarService } from '@shared/snackbar.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicService {

  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService,
    private appDataService: AppDataService
  )
  { }


  getBranches() {
    return this.apiService.sendHttpGetRequest('/branch')
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   getAcademicYear() {
    return this.apiService.sendHttpGetRequest('/academic')
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   saveAcademicYear(payload:any) {
    return this.apiService.sendHttpPostRequest('/academic',payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          console.log(resp)
          // this.snackBar.successNotification(message);
          this.snackBar.successDialog('',message)
          return data;
         })
       );
   }

   updateAcademicYear(id:number,payload:any) {
    return this.apiService.sendHttpUpdateRequest('/academic',id,payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          console.log(resp)
          // this.snackBar.successNotification(message);
          this.snackBar.successDialog('',message)
          return data;
         })
       );
   }

   findBranchesByAcademic(id:number) {
    return this.apiService.sendHttpGetRequest(`/branch/${id}/branches`)
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   saveAcademicBranch(payload:any) {
    return this.apiService.sendHttpPostRequest('/branch-academic',payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          console.log(resp)
          // this.snackBar.successNotification(message);
          this.snackBar.successDialog('',message)
          return data;
         })
       );
   }
   getBranchesWithAcademicByAcademicId(id:number) {
    return this.apiService.sendHttpGetRequest(`/branch-academic/academic/${id}`)
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   // levels

   findAllLevels() {
    return this.apiService.sendHttpGetRequest(`/level`)
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   findClassNotInLevelWithBranch(branchId: number) {
    return this.apiService.sendHttpGetRequest(`/class/classesNotInLevel/${branchId}`)
       .pipe(
         map((resp) => {
          const { data } = resp;
          return data;
         })
       );
   }

   assingLevelClasses(payload: any) {
    return this.apiService.sendHttpPostRequest(`/levelclass/add`,payload)
       .pipe(
         map((resp) => {
          const { message,data } = resp;
          this.snackBar.successDialog('',message)
          return data;
         })
       );
   }
}
