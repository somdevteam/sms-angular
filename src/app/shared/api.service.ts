import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import {catchError, map, Observable, throwError} from 'rxjs';
import { SnackbarService } from './snackbar.service';




@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,private snackBar:SnackbarService) { }

  sendHttpPostRequest(endpoint: string, payload: any) {
    const url = environment.apiUrl+endpoint;
    return this.http
      .post<any>(url, payload)
      .pipe(
        catchError(this.handleError),
      );
  }

  private handleError = (error: HttpErrorResponse) => {
      //handle 400, 403, 500
      if (error.status === 401) {
        if (error.url?.includes('auth/login')) {
          return throwError(new Error('Invalid username or password.'));
        }

        window.location.href = '/login';
      }

      let errorMessage = error.error?.message;

      let message = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;

      return throwError(message || 'Something went wrong; please try again.');
  };

  sendHttpGetRequest(endpoint: string) {
    const url = environment.apiUrl+endpoint;

    return this.http
      .get<any>(url)
      .pipe(
        catchError( this.handleError),
      );
  }

  sendHttpDeleteRequest(endpoint: string,id:number) {
    const url = `${environment.apiUrl+endpoint}/${id}`;
    return this.http
      .delete<any>(url)
      .pipe(
        catchError( this.handleError),
      );
  }

  sendHttpUpdateRequest(endpoint: string,id:number, payload: any) {
    const url = `${environment.apiUrl+endpoint}/${id}`;
    return this.http
      .patch<any>(url, payload)
      .pipe(
        catchError(this.handleError),
      );
  }

  createBranchWithUpload(endpoint:string,formData: FormData) {
    //const endpoint ='/branch/upload'
    const url = environment.apiUrl+endpoint;
    return this.http
      .post<FormData>(url, formData)
      .pipe(
        catchError(this.handleError),
      );

  }

}
