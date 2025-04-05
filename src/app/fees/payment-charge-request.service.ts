import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { ApiService } from '../shared/api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentChargeRequestService {
  constructor(private apiService: ApiService) {}

  getPaymentCharges(filters: any): Observable<any> {
    return this.apiService.sendHttpPostRequest('/payment-charge-request/filter', filters)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }

  generateCharges(data: any): Observable<any> {
    return this.apiService.sendHttpPostRequest('/payment-charge-request/generate-charges', data);
  }

  getChargeTypes(): Observable<any> {
    return this.apiService.sendHttpGetRequest('/payment-charge-request/charge-types');
  }
  markAsPaid(chargeId: number): Observable<any> {
    return this.apiService.sendHttpUpdateRequest('/payment-charge-request/mark-as-paid', chargeId, {});
  }

  collectPayment(chargeId: number): Observable<any> {
    return this.apiService.sendHttpUpdateRequest('/payment-charge-request/mark-as-paid', chargeId, {});
  }
}
