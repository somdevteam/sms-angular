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
    const errorMessage = error.error.message
    return throwError(errorMessage)
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
