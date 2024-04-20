import { Injectable } from '@angular/core';
import { ApiService } from '@shared/api.service';
import { AppDataService } from '@shared/app-data.service';
import { SnackbarService } from '@shared/snackbar.service';
import {map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService,
    private appDataService: AppDataService
  ) { }

  createBranch(payload: FormData) {
    return this.apiService.createBranchWithUpload('/branch',payload)
       .pipe(
         map((resp) => {
           console.log(resp);
         const resp1 = resp;
          this.snackBar.successDialog('','successfull')
          return resp;
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

  getBranchLogo(param:string='') {
    return this.apiService.sendHttpGetRequest(`/branch/branchlogo/${param}`)
      .pipe(
        map((resp) => {
          console.log(resp.data);
          const { message,data } = resp;
          return data;
        })
      );
  }


}
