import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentChargeRequestService } from '../../payment-charge-request.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-collect-fees-dialog',
  templateUrl: './collect-fees-dialog.component.html',
  styleUrls: ['./collect-fees-dialog.component.scss']
})
export class CollectFeesDialogComponent {
  paymentForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CollectFeesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentChargeService: PaymentChargeRequestService,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      amount: [data.charge.levelFee, [Validators.required, Validators.min(0)]],
      paymentDate: [new Date(), Validators.required],
      paymentMethod: ['CASH', Validators.required],
      referenceNumber: [''],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.loading = true;
      const paymentData = {
        ...this.paymentForm.value,
        chargeRequestId: this.data.charge.chargeRequestId,
        studentId: this.data.charge.studentId
      };

      this.paymentChargeService.collectPayment(paymentData).subscribe({
        next: (response) => {
          this.snackBar.open('Payment collected successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Error collecting payment', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 