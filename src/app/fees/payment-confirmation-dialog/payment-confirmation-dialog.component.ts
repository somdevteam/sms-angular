import {AfterViewInit, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-payment-confirmation-dialog',
  templateUrl: './payment-confirmation-dialog.component.html',
  styleUrls: ['./payment-confirmation-dialog.component.scss']
})
export class PaymentConfirmationDialogComponent {
  payments: any[] = [];
  displayedColumns: string[] = ['SFullName', 'className', 'sectionName', 'amount', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<PaymentConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { payments: any[] }
  ) {
    this.payments = [...data.payments]; // Clone data to avoid mutating the original array
  }

  removePayment(payment: any): void {
    this.payments = this.payments.filter(p => p !== payment);
    this.dialogRef.close({ action: 'remove', payment });
  }

  onAddAnother(): void {
    this.dialogRef.close({ action: 'add' });
  }

  onCreate(): void {
    this.dialogRef.close({ action: 'create', payments: this.payments });
  }
}

// export class PaymentConfirmationDialogComponent implements AfterViewInit {
//   payments: any[] = [];
//   displayedColumns: string[] = ['SFullName', 'ClassName', 'SectionName', 'Amount','Actions'];
//
//   constructor(
//     public dialogRef: MatDialogRef<PaymentConfirmationDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { payments: any[] }
//   ) {
//     this.payments = data.payments;
//   }
//
//   ngAfterViewInit(): void {
//     // Ensure focus is set on the dialog
//     setTimeout(() => {
//       const firstFocusableElement = document.querySelector('button') as HTMLElement;
//       if (firstFocusableElement) {
//         firstFocusableElement.focus();
//       }
//     }, 0);
//   }
//   removePayment(payment: any): void {
//     this.payments = this.payments.filter(p => p !== payment);
//   }
//
//   onAddAnother(): void {
//     this.dialogRef.close({ action: 'add' });
//   }
//
//   onCreate(): void {
//     this.dialogRef.close({ action: 'create' });
//   }
//
//
// }
