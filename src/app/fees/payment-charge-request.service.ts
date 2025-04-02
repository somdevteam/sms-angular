import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentChargeRequestService {
  private apiUrl = `${environment.apiUrl}/payment-charge-request`;

  constructor(private http: HttpClient) { }

  getPaymentCharges(filters: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filters });
  }

  getPaymentCharge(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPaymentCharge(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updatePaymentCharge(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  markAsPaid(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/mark-paid`, {});
  }

  generateCharges(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-charges`, data);
  }
} 