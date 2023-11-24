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
}
