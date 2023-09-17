import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import { catchError, map, throwError } from 'rxjs';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';




@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,private pageLoader:PageLoaderService) { }

  sendHttpPostRequest(endpoint: string, payload: any,isLoader:boolean = false) {
    const url = environment.apiUrl+endpoint;
    if(isLoader) this.pageLoader.showLoader();
    return this.http
      .post<any>(url, payload)
      .pipe(
        catchError(this.handleError),
        map((resp) => {
          this.pageLoader.hideLoader();
          const { data } = resp;
          return data;
        }
        )
      );
  }

  private handleError = (error: HttpErrorResponse) => {
    this.pageLoader.hideLoader();
    const errorMessage = error.error.message
    return throwError(errorMessage)
  };

  sendHttpGetRequest(endpoint: string,isLoader:boolean = false) {
    const url = environment.apiUrl+endpoint;
   if(isLoader) this.pageLoader.showLoader()
    return this.http
      .get<any>(url)
      .pipe(
        catchError( this.handleError),
        map((resp) => {
          this.pageLoader.hideLoader();
          const { data } = resp;
          return data;
        }
        )
      );
  }
}
