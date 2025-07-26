import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FeesService} from '../../fees.service';
import {PaymentChargeRequestService} from '../../payment-charge-request.service';
import {SnackbarService} from '@shared/snackbar.service';
import {BranchService} from "../../../branch/branch.service";
import {PageLoaderService} from "../../../layout/page-loader/page-loader.service";

@Component({
  selector: 'app-generate-charges-dialog',
  templateUrl: './generate-charges-dialog.component.html',
  styleUrls: ['./generate-charges-dialog.component.scss'],
})
export class GenerateChargesDialogComponent implements OnInit {
  generateForm: FormGroup;
  chargeTypes: any[] = [];
  branches: any[] = [];
  feeTypes: any[] = [];
  months: any[] = [];
  isMonthlyChargeType = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenerateChargesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private branchService: BranchService,
    private snackBar: SnackbarService,
    private feesService: FeesService,
    private pageLoader: PageLoaderService,
    private paymentChargeRequestService: PaymentChargeRequestService
  ) {
    this.generateForm = this.fb.group({
      chargeTypeCode: ['', Validators.required],
      monthId: [''],
      feeTypeId: ['', Validators.required],
      branchId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.chargeTypes = this.data.chargeTypes;
    // this.loadBranches();
    // this.loadMonths();
    this.loadDropdownData();
  }

  private loadDropdownData() {
    this.pageLoader.showLoader();

    this.feesService.getFeeTypes().subscribe({
      next: (response) => {
        console.log(response);
        this.feeTypes = response || [];
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading payment types');
      }
    });

    this.branchService.getBranches().subscribe({
      next: (response) => {
        this.branches = response || [];
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading payment types');
      }
    });

    this.feesService.getMonths().subscribe({
      next: (response) => {
        this.months = response.data;
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading months');
      },
      complete: () => {
        this.pageLoader.hideLoader();
      }
    });

    this.feesService.getAllMonths().subscribe({
      next: (response) => {
        this.months = response.data || [];
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading months');
      },
      complete: () => {
        this.pageLoader.hideLoader();
      }
    });
  }


  onSubmit(): void {
    if (this.generateForm.valid) {
      const formValues = this.generateForm.value;
      const storage = localStorage.getItem('currentUser') ?? '{}';
      const userInfo = JSON.parse(storage);
    console.log(formValues);

      const payload = {
        createdBy: userInfo.id,
        chargeTypeCode: formValues.chargeTypeCode,
        monthId: formValues.monthId ? formValues.monthId : null,
        feeTypeId: Number(formValues.feeTypeId),
        branchId: Number(formValues.branchId),
      };
      this.paymentChargeRequestService.generateCharges(payload).subscribe({
        next: (response) => {
          this.snackBar.successNotification(
            'Payment charge created successfully'
          );

          const result = {
            error : null,
            isValid: true
          }
          this.dialogRef.close(true);
        },
        error: (error) => {
          const errorMessage = error || 'Error while creating payment charge request';

          this.snackBar.dangerNotification(errorMessage);
          const result = {
            error : errorMessage,
            isValid: false
          }

          this.dialogRef.close(result);
        },
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
    this.isMonthlyChargeType = chargeTypeCode === 'monthly';
  }
}
