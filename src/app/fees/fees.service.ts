import { Injectable } from '@angular/core';
import {ApiService} from "@shared/api.service";
import {SnackbarService} from "@shared/snackbar.service";
import {AppDataService} from "@shared/app-data.service";
import {map, Observable} from "rxjs";
import { StudentFeeInfo } from './types/student-fee.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../src/environments/environment';
import {PaymentFormData} from "./addfees/addfees.component";
import { ApiBaseResponse } from '../common/dto/apiresponses.dto';

interface StudentClass {
  studentClassId: number;
  classId: number;
  className: string;
  sectionId: number;
  sectionName: string;
  classSectionId: number;
  levelClassId: number;
  levelId: number;
  levelName: string;
  levelFee: number;
  isActive: boolean;
}

interface Student {
  studentid: number;
  rollNumber: string;
  firstname: string;
  middlename: string;
  lastname: string;
  Sex: string;
  dob: string;
  bob: string;
  fullName: string;
  studentClass: StudentClass[];
}

export interface ApiResponse {
  message: string;
  status: number;
  data: Student[];
}

@Injectable({
  providedIn: 'root'
})
export class FeesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private apiService:ApiService,
    private snackBar:SnackbarService,
    private appDataService: AppDataService,
    private http: HttpClient
  )
  {
    //this.userOperation = this.appDataService.support_data['userOperation'] || null;
  }

  // getStudentByRollNumber(rollNumber: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/payment/student/${rollNumber}`);
  // }

  // getResponsibleByMobile(mobile: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/payment/responsible/${mobile}`);
  // }

  getAllPaymentTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment/findAllPaymentTypes`);
  }

  getAllPaymentStates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment/findAllPaymentStates`);
  }

  getAllMonths(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/payment/findAllMonths`);
  }

  createPayment(paymentData: PaymentFormData): Observable<any> {
    // Remove the nested payments structure
    return this.apiService.sendHttpPostRequest('/payment/add', paymentData)
      .pipe(
        map((resp) => {
          const { message, data } = resp;
          this.snackBar.successNotification(message);
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

  getClasses() {
    return this.apiService.sendHttpGetRequest('/class/list/all')
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  getSections(): Observable<any> {
    return this.apiService.sendHttpGetRequest(`/section`)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  getSectionsByClassId(classId: number): Observable<any> {
    return this.apiService.sendHttpGetRequest(`/section/by-class/${classId}`)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }



  getBranches(): Observable<any> {
    return this.apiService.sendHttpGetRequest('/branch/all');
  }

  getMonths(): Observable<any> {
    return this.apiService.sendHttpGetRequest('/payment/findAllMonths');
  }

  generateReceipt(paymentIds: number) {
    return this.apiService.sendHttpPostRequest('/payment/generate-receipts', { paymentIds });
  }

  getStudentsByRollNumber(rollNumber: string): Observable<any> {
    return this.apiService.sendHttpPostRequest('/student/getStudentsByRollNumber', { rollNumber })
      .pipe(
        map((resp: any) => {
          return resp;
        })
      );
  }

  getStudentsByResponsibleMobile(mobile: string): Observable<any> {
    return this.apiService.sendHttpPostRequest('/student/getStudentsByResponsibleMobile', { mobile })
      .pipe(
        map((resp) => {
          return resp
        })
      );
  }

  getPaymentss(payload:any) {
    return this.apiService.sendHttpPostRequest('/payment/getPaymentByFilter',payload)
      .pipe(
        map((resp) => {
          const { message,data } = resp;
          return data;
        })
      );
  }

}
