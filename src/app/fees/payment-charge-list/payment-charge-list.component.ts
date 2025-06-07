import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentChargeRequestService } from '../payment-charge-request.service';
import { GenerateChargesDialogComponent } from './generate-charges-dialog/generate-charges-dialog.component';
import { FeesService } from '../fees.service';
import { CollectFeesDialogComponent } from './collect-fees-dialog/collect-fees-dialog.component';
import { formatDate } from '@shared/utilities';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

interface PaymentCharge {
  chargeRequestId: number;
  chargeType: string;
  chargedMonth: string;
  studentFullName: string;
  dueDate: Date;
  dateCreated: Date;
  academicYear: string;
  status: string;
  levelFee: number;
  className: string;
  sectionName: string;
  studentId: number;
  rollNumber: number;
}

@Component({
  selector: 'app-payment-charge-list',
  templateUrl: './payment-charge-list.component.html',
  styleUrls: ['./payment-charge-list.component.scss'],
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
    'actions',
  ];
  dataSource: MatTableDataSource<PaymentCharge> =
    new MatTableDataSource<PaymentCharge>([]);
  filterForm: FormGroup;
  classes: any[] = [];
  sections: any[] = [];
  chargeTypes: any[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
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
      endDate: [''],
    });

    // Subscribe to date changes to handle status field
    this.filterForm
      .get('startDate')
      ?.valueChanges.subscribe(() => this.updateStatusFieldState());
    this.filterForm
      .get('endDate')
      ?.valueChanges.subscribe(() => this.updateStatusFieldState());
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
        this.snackBar.open('Error loading classes', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  loadChargeTypes(): void {
    this.paymentChargeService.getChargeTypes().subscribe({
      next: (response) => {
        this.chargeTypes = response.data;
      },
      error: (error) => {
        this.snackBar.open('Error loading charge types', 'Close', {
          duration: 3000,
        });
      },
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
          this.snackBar.open('Error loading sections', 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      this.sections = [];
      this.filterForm.patchValue({ sectionId: '' });
    }
  }

  updateStatusFieldState(): void {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    const statusControl = this.filterForm.get('status');

    if (startDate && endDate) {
      statusControl?.disable();
      statusControl?.setValue('');
    } else {
      statusControl?.enable();
    }
  }

  loadPaymentCharges(): void {
    this.loading = true;
    const formValues = this.filterForm.value;
    const payload = {
      classId: Number(formValues.classId) || null,
      chargeTypeId: Number(formValues.chargeTypeId) || null,
      sectionId: Number(formValues.sectionId) || null,
      startDate: formValues.startDate ? formatDate(formValues.startDate) : null,
      endDate: formValues.endDate ? formatDate(formValues.endDate) : null,
      status: formValues.status,
      page: this.currentPage,
      limit: this.pageSize,
    };

    this.paymentChargeService.getPaymentCharges(payload).subscribe({
      next: (response) => {
        console.log('Response:', response);
        if (response && response.data) {
          this.dataSource = new MatTableDataSource<PaymentCharge>(
            response.data
          );
          this.totalItems = response.total;
        } else {
          this.dataSource = new MatTableDataSource<PaymentCharge>([]);
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.snackBar.open('Error loading payment charges', 'Close', {
          duration: 3000,
        });
        this.dataSource = new MatTableDataSource<PaymentCharge>([]);
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadPaymentCharges();
  }

  openGenerateChargesDialog(): void {
    const dialogRef = this.dialog.open(GenerateChargesDialogComponent, {
      width: '500px',
      data: {
        chargeTypes: this.chargeTypes,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.snackBar.open('Charges generated successfully', 'Close', {
          duration: 3000,
        });
        //this.loadPaymentCharges();
      } else if (result === false) {
        this.snackBar.open('Failed to generate charges', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  openCollectFeesDialog(charge: any): void {
    const dialogRef = this.dialog.open(CollectFeesDialogComponent, {
      width: '500px',
      data: {
        charge: charge,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
