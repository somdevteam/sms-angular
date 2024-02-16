import { Injectable } from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;

    const loggedIn = this.checkAuthentication(url);
    if (loggedIn !== true) {
      return loggedIn;
    }
    return this.checkAuthorization(route);
  }

  checkAuthentication(url: string): boolean | UrlTree {
    const loggedIn = this.authService.currentUserValue.token;;
    if (!loggedIn) {
      return this.router.parseUrl('/login');
    }

    if (url === '/login') {
      return this.router.parseUrl('/dashboard');
    }
    return true;
  }

  checkAuthorization(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const {permissions: requiredPermissions = [], accessibleToAdmin = true} =
    route.data || {};
    const authorized =
      this.authService.isUserAuthorized(requiredPermissions);
    if (authorized) {
      return true;
    }
    this.router.navigate(['/authentication/signin']);
    return false;
  }
}
