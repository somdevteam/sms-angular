import { Injectable } from '@angular/core';
import {ApiService} from "@shared/api.service";
import {SnackbarService} from "@shared/snackbar.service";
import {AppDataService} from "@shared/app-data.service";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FeesService {

  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService,
    private appDataService: AppDataService,

  )
  {
    //this.userOperation = this.appDataService.support_data['userOperation'] || null;
  }

  getStudentByRollNumber(rollNumber:number) {
    return this.apiService.sendHttpPostRequest('/student/getStudentByRollNumber',rollNumber)
      .pipe(
        map((resp) => {
          const { message,data } = resp;
          return data;
        })
      );
  }

  getPaymentTypes() {
    return this.apiService.sendHttpGetRequest('/payment/findAllPaymentTypes')
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }

}
