import { Injectable } from '@angular/core';
import {ApiService} from "@shared/api.service";
import {SnackbarService} from "@shared/snackbar.service";
import {AppDataService} from "@shared/app-data.service";
import {map, Observable} from "rxjs";

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

  getStudentByRollNumber(rollNumber:any) {
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
  getPaymentStates() {
    return this.apiService.sendHttpGetRequest('/payment/findAllPaymentStates')
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }

  getFeeTypes() {
    return this.apiService.sendHttpGetRequest('/payment/findAllFeeTypes')
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }
  createPayment(payload:any) {
    return this.apiService.sendHttpPostRequest('/payment/add',payload)
      .pipe(
        map((resp) => {
          const { message,data } = resp;
          this.snackBar.successNotification(message)
          return data;
        })
      );
  }

  createMultiplePayments(payload: any[]): Observable<any> {
    return this.apiService.sendHttpPostRequest('/payment/add-multiple', { payments: payload })
      .pipe(
        map((resp) => {
          const { message, data } = resp;
          this.snackBar.successNotification(message);
          return data;
        })
      );
  }

  getMonths() {
    return this.apiService.sendHttpGetRequest('/payment/findAllMonths')
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }

  getPayments(payload:any) {
    return this.apiService.sendHttpPostRequest('/payment/getPaymentByFilter',payload)
      .pipe(
        map((resp) => {
          const { message,data } = resp;
          return data;
        })
      );
  }
  getStudentsByResponsible(respId:number) {
    const responsibleId ={responsibleId:respId}
    console.log("respId:"+respId);
    return this.apiService.sendHttpPostRequest('/student/getStudentsByResponsibleId',responsibleId)
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }

  getStudentPaymentsByLevel(levelId:number) {
    return this.apiService.sendHttpGetRequest('/payment/findStudentPaymentByLevel')
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }

  getStudentDetails(studentId:number) {
    return this.apiService.sendHttpGetRequest('/student/studentId')
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.log(data);
          return data;
        })
      );
  }
  getResponsibleByMobile(mobile: string) {
    return this.apiService.sendHttpGetRequest(`/responsible/getResponsibleByPhone/${mobile}`)
      .pipe(
        map((resp) => {
          const { data } = resp;
          console.warn("data of the responsible"+JSON.stringify(data));
          return data;
        })
      );  }




}
