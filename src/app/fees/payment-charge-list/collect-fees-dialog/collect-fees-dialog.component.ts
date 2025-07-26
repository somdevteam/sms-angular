import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeesService } from '../../fees.service';
import { SnackbarService } from '@shared/snackbar.service';
import { ReceiptComponent } from '../../receipt/receipt.component';

@Component({
  selector: 'app-collect-fees-dialog',
  templateUrl: './collect-fees-dialog.component.html',
  styleUrls: ['./collect-fees-dialog.component.scss'],
})
export class CollectFeesDialogComponent implements OnInit {
  paymentForm: FormGroup;
  loading = false;
  paymentTypes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private feesService: FeesService,
    private dialogRef: MatDialogRef<CollectFeesDialogComponent>,
    private dialog: MatDialog,
    private snackBar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { charge: any }
  ) {
    this.paymentForm = this.fb.group({
      amount: [
        this.data.charge.amount,
        [Validators.required, Validators.min(0)],
      ],
      paymentTypeId: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadPaymentTypes();
  }

  loadPaymentTypes(): void {
    this.feesService.getAllPaymentTypes().subscribe({
      next: (response) => {
        if (response?.data) {
          this.paymentTypes = response.data;
          // Set default payment type if available
          if (this.paymentTypes.length > 0) {
            this.paymentForm.patchValue({
              paymentTypeId: this.paymentTypes[0].paymenttypeid,
            });
          }
        }
      },
      error: (error) => {
        this.snackBar.dangerNotification(
          error?.error?.message || 'Error loading payment types'
        );
      },
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.snackBar.warningNotification('Please fill in all required fields');
      return;
    }

    this.loading = true;
    const formData = this.paymentForm.value;

    const paymentData = {
      studentId: this.data.charge.studentId,
      studentClassId: this.data.charge.studentClassId,
      amount: formData.amount,
      monthId: this.data.charge.monthId,
      monthName: this.data.charge.chargedMonth,
      paymentTypeId: formData.paymentTypeId,
      paymentStateId: 1, // PAID status
      responsibleId: this.data.charge.responsibleId,
      rollNo: this.data.charge.rollNumber.toString(),
      chargeRequestId: this.data.charge.chargeRequestId,
      details: `Payment for ${this.data.charge.chargeType} - ${
        this.data.charge.chargedMonth
      }. Notes: ${formData.notes || 'N/A'}`,
      isAutomatedPayment: true,
      branchId:Number(this.data.charge.branchId),
      feeTypeId:Number(this.data.charge.feeTypeId)
    };

    this.feesService.createPayment(paymentData).subscribe({
      next: (response) => {
        this.snackBar.successNotification('Payment Created Successfully');
        this.loading = false;
        const dialogRef = this.dialog.open(ReceiptComponent, {
          width: '600px',
          data: { payments: response.receipt },
        });
        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        });
      },
      error: (error) => {
        this.snackBar.dangerNotification(
          error || 'Error collecting payment'
        );
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
