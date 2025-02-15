import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {
  payments: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log("Data received in receipt component:", data);
    this.payments = data.payments || [];
  }

  get totalAmount() {
    return this.payments.reduce((sum, item) => sum + item.amount, 0);
  }

  printReceipt() {
    window.print();
  }
}
