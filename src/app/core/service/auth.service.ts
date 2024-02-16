import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user';
import {ApiService} from '@shared/api.service';
import {SnackbarService} from '@shared/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,private apiService: ApiService,private snackBar:SnackbarService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }



  login(username: string, password: string) {
    const payload = { username: username, password: password };
   return this.apiService.sendHttpPostRequest('/auth/login',payload)
      .pipe(
        map((resp) => {
          const { message,data } = resp;
          this.snackBar.successNotification(message)
          localStorage.setItem('currentUser', JSON.stringify(data));
          this.currentUserSubject.next(data);
          return data;
        })
      );
  }

  isUserAuthorized(requiredPermission: string | string[]): boolean {
    if (!requiredPermission || !requiredPermission.length) {
      return true;
    }

    const userPermissions = this.currentUserValue?.permissions;
    if (!userPermissions || !userPermissions.length) {
      return false;
    }

    const permissions = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];
    return permissions.some((p) => userPermissions.includes(p));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
