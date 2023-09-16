import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'environments/environment';
import { ApiResult } from 'app/model/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  

  login(username: string, password: string) {
    return this.http
      .post<any>(`http://0.0.0.0:3000/auth/login`, {
        username,
        password,
      })
      .pipe(
        map((user:ApiResult) => {
          
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          let data = user.data;
          console.log(data)
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user.data);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
