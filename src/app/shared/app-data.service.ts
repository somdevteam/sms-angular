import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  dataTableList = 'assets/content/datatableStatic.json';
  support_data: { [key: string]: any } = {}; // Define the type for support_data

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {
    const supportDataString = localStorage.getItem('SUPPORT_DATA');
    if (supportDataString) {
      this.support_data = JSON.parse(supportDataString);
    }
  }

  set_support_data(prop: string, value: any) {
    this.support_data[prop] = value;
    localStorage.setItem('SUPPORT_DATA', JSON.stringify(this.support_data));
  }

  delete_support_data_key(prop: string) {
    delete this.support_data[prop];
    localStorage.setItem('SUPPORT_DATA', JSON.stringify(this.support_data));
  }

  delete_support_data() {
    localStorage.removeItem('SUPPORT_DATA');
  }
}
