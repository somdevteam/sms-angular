import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import { catchError, map, throwError } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  sendHttpPostRequest(endpoint: string, payload: any) {
    const url = environment.apiUrl+endpoint;
    return this.http
      .post<any>(url, payload)
      .pipe(
        catchError(this.handleError),
        map((resp) => {
          const { data } = resp;
          return data;
        }
        )
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
      
      return throwError(new Error(error.error?.message || 'Something went wrong; please try again.', { cause: error }));
  };

  sendHttpGetRequest(endpoint: string) {
    const url = environment.apiUrl+endpoint;
    return this.http
      .get<any>(url)
      .pipe(
        catchError( this.handleError),
        map((resp) => {
          const { data } = resp;
          return data;
        }
        )
      );
  }
}
