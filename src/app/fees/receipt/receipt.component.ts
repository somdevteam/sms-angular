import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DecimalPipe, DatePipe } from '@angular/common';

interface SchoolInfo {
  schoolName: string;
  schoolAddress: string;
  schoolContact: string;
  schoolEmail: string;
}

interface PaymentDetails {
  receiptId: string;
  paymentId: number;
  fullname: string;
  monthName: string;
  paymentState: string;
  amount: number;
  rollNo: string;
  dateCreated: string;
  responsibleName: string;
  totalAmount: number;
  className: string;
  sectionName: string;
  paymentType: string;
}

interface Receipt {
  header: SchoolInfo;
  paymentDetails: PaymentDetails;
}

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class ReceiptComponent {
  receipts: Receipt[];

  constructor(
    public dialogRef: MatDialogRef<ReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payments: Receipt[] },
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe
  ) {
    this.receipts = data.payments;
  }

  formatAmount(amount: number): string {
    if (!amount) return '$0.00';
    return `$${this.decimalPipe.transform(amount, '1.2-2')}`;
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'medium') || '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  printReceipt(): void {
    window.print();
  }
}
