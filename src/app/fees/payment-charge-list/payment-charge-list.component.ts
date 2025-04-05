import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentChargeRequestService } from '../payment-charge-request.service';
import { GenerateChargesDialogComponent } from './generate-charges-dialog/generate-charges-dialog.component';
import { FeesService } from "../fees.service";
import { CollectFeesDialogComponent } from './collect-fees-dialog/collect-fees-dialog.component';
import {formatDate} from "@shared/utilities";

@Component({
  selector: 'app-payment-charge-list',
  templateUrl: './payment-charge-list.component.html',
  styleUrls: ['./payment-charge-list.component.scss']
})
export class PaymentChargeListComponent implements OnInit {
  displayedColumns: string[] = [
    'studentFullName',
    'rollNumber',
    'className',
    'sectionName',
    'levelFee',
    'dueDate',
    'chargeType',
    'status',
    'actions'
  ];
  dataSource: any[] = [];
  filterForm: FormGroup;
  classes: any[] = [];
  sections: any[] = [];
  chargeTypes: any[] = [];
  loading = false;
  breadscrums = [
    {
      title: 'Payment',
      items: ['Payment Charge'],
      active: 'Payments',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private paymentChargeService: PaymentChargeRequestService,
    private feesService: FeesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      classId: [''],
      sectionId: [''],
      status: [''],
      chargeTypeId: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadChargeTypes();
   // this.loadPaymentCharges();
  }

  loadClasses(): void {
    this.feesService.getClasses().subscribe({
      next: (response) => {
        this.classes = response.data;
      },
      error: (error) => {
        this.snackBar.open('Error loading classes', 'Close', { duration: 3000 });
      }
    });
  }

  loadChargeTypes(): void {
    this.paymentChargeService.getChargeTypes().subscribe({
      next: (response) => {
        this.chargeTypes = response.data;
      },
      error: (error) => {
        this.snackBar.open('Error loading charge types', 'Close', { duration: 3000 });
      }
    });
  }

  onClassChange(): void {
    const classId = this.filterForm.get('classId')?.value;
    if (classId) {
      this.feesService.getSections().subscribe({
        next: (response) => {
          this.sections = response.data;
          this.filterForm.patchValue({ sectionId: '' });
        },
        error: (error) => {
          this.snackBar.open('Error loading sections', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.sections = [];
      this.filterForm.patchValue({ sectionId: '' });
    }
  }

  loadPaymentCharges(): void {
    this.loading = true;
    const formValues = this.filterForm.value;
    const payload = {
      classId: Number(formValues.classId),
      chargeTypeId:Number( formValues.chargeTypes),
      sectionId: Number(formValues.sectionId),
      startDate : formValues.startDate ? formatDate(formValues.startDate) : null,
      endDate : formValues.endDate ? formatDate(formValues.endDate) : null,
      status:formValues.status
    }
    this.paymentChargeService.getPaymentCharges(payload).subscribe({
      next: (response) => {
        this.dataSource = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading payment charges', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openGenerateChargesDialog(): void {
    const dialogRef = this.dialog.open(GenerateChargesDialogComponent, {
      width: '500px',
      data: {
        chargeTypes: this.chargeTypes
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentChargeService.generateCharges(result).subscribe({
          next: (response) => {
            this.snackBar.open('Payment charges generated successfully', 'Close', { duration: 3000 });
            this.loadPaymentCharges();
          },
          error: (error) => {
            this.snackBar.open('Error generating payment charges', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openCollectFeesDialog(charge: any): void {
    const dialogRef = this.dialog.open(CollectFeesDialogComponent, {
      width: '500px',
      data: {
        charge: charge
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPaymentCharges();
      }
    });
  }

  applyFilters(): void {
    this.loadPaymentCharges();
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.sections = [];
    this.loadPaymentCharges();
  }
}
