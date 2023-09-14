import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.development";
import { ApiError, ApiResult } from '../models/apiresponse';
import {AuthService} from "@core";



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  loginTokenResp: any;
  constructor(private http: HttpClient) { }

  sendHttpPostRequest(endpoint: string, payload: any, options?: any): Promise<ApiResult> {
    return new Promise<ApiResult>((resolve, reject) => {

      this.loginTokenResp = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': 'Bearer ' + this.loginTokenResp });
      options = options ? options : { headers: headers };
      const url = environment.apiUrl+endpoint;
      this.http.post(url, payload, options)
        .toPromise()
        .then((apiResponse: any) => {
          resolve(apiResponse)
        }).catch((apiError: ApiError) => {
          if (apiError.error.statusCode == 401) {
           // this.authService.logout();
            apiError.message = 'Your session with us is expired.Please login again.';
          }
          reject(apiError)
        })
    });
  }

  // sendHttpGetRequest(endpoint: string, payload: any, options?: any): Promise<ApiResult> {
  //   return new Promise<ApiResult>((resolve, reject) => {
  //
  //     this.loginTokenResp = localStorage.getItem('token');
  //     const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Authorization': 'Bearer ' + this.loginTokenResp });
  //     options = options ? options : { headers: headers };
  //     const endPointUrl = environment.apiProtocol + '://' + environment.apiServerIP + ':' + environment.apiServerPort + endpoint;
  //     this.http.get(endPointUrl, options)
  //       .toPromise()
  //       .then((apiResponse: any) => {
  //         resolve(apiResponse)
  //       }).catch((apiError: ApiError) => {
  //         if (apiError.error.statusCode == 401) {
  //           this.authService.logout();
  //           apiError.message = 'Your session with us is expired.Please login again.';
  //         }
  //         reject(apiError)
  //       })
  //   });
  //
  // }

}
