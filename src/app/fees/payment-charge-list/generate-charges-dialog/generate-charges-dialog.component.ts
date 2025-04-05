import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeesService } from '../../fees.service';
import {PaymentChargeRequestService} from "../../payment-charge-request.service";
import {SnackbarService} from "@shared/snackbar.service";

@Component({
  selector: 'app-generate-charges-dialog',
  templateUrl: './generate-charges-dialog.component.html',
  styleUrls: ['./generate-charges-dialog.component.scss']
})
export class GenerateChargesDialogComponent implements OnInit {
  generateForm: FormGroup;
  chargeTypes: any[] = [];
  branches: any[] = [];
  months: any[] = [];
  isMonthlyChargeType =true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenerateChargesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: SnackbarService,
    private feesService: FeesService,
    private paymentChargeRequestService:PaymentChargeRequestService
  ) {
    this.generateForm = this.fb.group({
      chargeTypeCode: ['', Validators.required],
      monthId: ['']
    });
  }

  ngOnInit(): void {
    this.chargeTypes = this.data.chargeTypes;
    this.loadBranches();
    this.loadMonths();
  }

  loadBranches(): void {
    this.feesService.getBranches().subscribe({
      next: (response) => {
        this.branches = response.data;
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading branches');
      }
    });
  }

  loadMonths(): void {
    this.feesService.getMonths().subscribe({
      next: (response) => {
        this.months = response.data;
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading months');
      }
    });
  }

  onSubmit(): void {
    if (this.generateForm.valid) {
      const formValues = this.generateForm.value;
      const storage =  localStorage.getItem('currentUser') ?? '{}';
      const userInfo = JSON.parse(storage);

      const payload ={
        createdBy : userInfo.id,
        branchId : userInfo.branch,
        chargeTypeCode: formValues.chargeTypeCode,
        monthId: formValues.monthId ? formValues.monthId :null
      }
      this.paymentChargeRequestService.generateCharges(payload).subscribe({
        next: (response) => {
          this.snackBar.successNotification('Payment charge created successfully');
          this.months = response.data;
          this.dialogRef.close(this.generateForm.value);
        },
        error: (error) => {
          this.snackBar.dangerNotification('Error while creating payment charge request');

        }
      });
    } else {
      this.snackBar.dangerNotification('Please fill all required fields');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  onChargeTypeSelected(): void {
    const chargeTypeCode = this.generateForm.get('chargeTypeCode')?.value;
    if(chargeTypeCode && chargeTypeCode !='monthly'){
      this.isMonthlyChargeType =false;
    }

  }
}
