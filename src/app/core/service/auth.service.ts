import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import {ApiError, ApiResult} from "../../models/apiresponse";
import {ApiService} from "@shared/api.service";
import {Utilities} from "@shared/utilities";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Promise<ApiResult> {
    return new Promise<ApiResult>((resolve, reject) => {
      //const endpoint = Utilities.getEndpointUrlByApiName('login');
      const endpoint = '/auth/login'
      const payload = { username: username, password: password };
      this.apiService
        .sendHttpPostRequest(endpoint, payload)
        .then((resp: ApiResult) => {
          if (resp.message == "Login Successfully" && resp.data.token) {
            localStorage.setItem('token', resp.data.token);
            localStorage.setItem('currentUser', JSON.stringify(resp.data));
            this.currentUserSubject.next(resp.data);
            //return resp.data;
          }
          resolve(resp);
        })
        .catch((err: ApiError) => {
          console.log('START- EXCEPTION ON LOGIN');
          console.log(err);
          console.log('END- EXCEPTION ON LOGIN');
          reject(err.error);
        });
    });
  }



  // login(username: string, password: string) {
  //   const endpoint = Utilities.getEndpointUrlByApiName('login');
  //   const payload = { username: username, password: password };
  //   return this.http
  //     .post<User>(`${environment.apiUrl}/auth/login`, {
  //       username,
  //       password,
  //     })
  //     .pipe(
  //       map((user) => {
  //         // store user details and jwt token in local storage to keep user logged in between page refreshes
  //
  //         localStorage.setItem('token', user.token);
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //         return user;
  //       })
  //     );

    // login(username: string, password: string) {
    //   const endpoint = Utilities.getEndpointUrlByApiName('login');
    //   const payload = { username: username, password: password };
    //   return this.http
    //     .post<User>(`${environment.apiUrl}/auth/login`, {
    //       username,
    //       password,
    //     })
    //     .pipe(
    //       map((user) => {
    //         // store user details and jwt token in local storage to keep user logged in between page refreshes
    //
    //         localStorage.setItem('token', user.token);
    //         localStorage.setItem('currentUser', JSON.stringify(user));
    //         this.currentUserSubject.next(user);
    //         return user;
    //       })
    //     );
    // }
    //


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
