// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AppDataService {
//
//   dataTableList = 'assets/content/datatableStatic.json'
//   support_data: any;
//
//   constructor(private http:HttpClient)
//   { this.init(); }
//
//   init() {
//     this.support_data = JSON.parse(localStorage.getItem('SUPPORT_DATA')) || {};
//     if(Object.keys(this.support_data).length) {
//       for (const key in this.support_data) {
//         if (this.support_data[key]) {
//           this[key] = this.support_data[key];
//         }
//       }
//     }
//   }
//
//   set_support_data(prop, value) {
//     this.support_data[prop] = value;
//     localStorage.setItem('SUPPORT_DATA', JSON.stringify(this.support_data))
//   }
//
//   delete_support_data_key(prop, value) {
//     delete this.support_data[prop];
//     localStorage.setItem('SUPPORT_DATA', JSON.stringify(this.support_data))
//   }
//
//   delete_support_data() {
//     localStorage.removeItem('SUPPORT_DATA')
//   }
//
//
// }
