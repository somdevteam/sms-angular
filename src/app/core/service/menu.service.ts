import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "@shared/api.service";
import {SnackbarService} from "@shared/snackbar.service";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient,private apiService: ApiService,private snackBar:SnackbarService) { }

  getMenusByUserId(payload:any) {
    const url = `/menus`;
    return this.apiService.sendHttpGetRequest(url)
      .pipe(
        map((resp) => {
          const { message,data } = resp;
          return data;
        })
      );
  }
}
