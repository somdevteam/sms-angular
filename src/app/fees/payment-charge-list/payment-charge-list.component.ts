import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentChargeRequestService } from '../payment-charge-request.service';
import { GenerateChargesDialogComponent } from './generate-charges-dialog/generate-charges-dialog.component';
import {FeesService} from "../fees.service";

@Component({
  selector: 'app-payment-charge-list',
  templateUrl: './payment-charge-list.component.html',
  styleUrls: ['./payment-charge-list.component.scss']
})
export class PaymentChargeListComponent implements OnInit {
  displayedColumns: string[] = [
    'studentName',
    'rollNo',
    'className',
    'sectionName',
    'amount',
    'dueDate',
    'dueCategory',
    'status',
    'actions'
  ];
  dataSource: any[] = [];
  filterForm: FormGroup;
  classes: any[] = [];
  sections: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private paymentChargeService: PaymentChargeRequestService,
    private feesService:FeesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      classId: [''],
      sectionId: [''],
      status: [''],
      dueCategory: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadPaymentCharges();
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
    }
  }

  loadPaymentCharges(): void {
    this.loading = true;
    const filters = this.filterForm.value;
    this.paymentChargeService.getPaymentCharges(filters).subscribe({
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
        classes: this.classes,
        sections: this.sections
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

  markAsPaid(chargeId: number): void {
    this.paymentChargeService.markAsPaid(chargeId).subscribe({
      next: (response) => {
        this.snackBar.open('Payment marked as paid successfully', 'Close', { duration: 3000 });
        this.loadPaymentCharges();
      },
      error: (error) => {
        this.snackBar.open('Error marking payment as paid', 'Close', { duration: 3000 });
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
