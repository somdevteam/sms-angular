import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FeesService } from "../fees.service";
import { SnackbarService } from "@shared/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { ReceiptComponent } from '../receipt/receipt.component';
import {formatDate} from "@shared/utilities";

interface Class {
  classid: number;
  classname: string;
  datecreated: string;
}

interface Section {
  sectionid: number;
  sectionname: string;
  datecreated: string;
  isactive: boolean;
}

interface ReceiptResponse {
  receiptId: string;
  paymentId: number;
  fullname: string;
  monthName: string;
  paymentState: string;
  amount: string;
  rollNo: string;
  dateCreated: string;
  responsibleName: string;
  totalAmount: number;
}

@Component({
  selector: 'app-allfees',
  templateUrl: './allfees.component.html',
  styleUrls: ['./allfees.component.scss']
})
export class AllfeesComponent implements OnInit {
  paymentForm: FormGroup;
  payments = new MatTableDataSource<any>([]);
  branches: any[] = [];
  classes: Class[] = [];
  sections: Section[] = [];

  displayedColumns: string[] = [
    'studentfeeid',
    'amount',
    'studentFullName',
    'rollNumber',
    'paymentType',
    'paymentState',
    'datecreated',
    'actions'
  ];
  breadscrums = [
    {
      title: 'Payment',
      items: ['List Of Payments'],
      active: 'Payments',
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private feesServices: FeesService,
    private snackBar: SnackbarService,
    private dialog: MatDialog,
    private pageLoader: PageLoaderService,
  ) {
    this.paymentForm = this.fb.group({
      searchFilter: [''],
      startDate: [],
      endDate: [],
      class: [''],
      section: [''],
      type: [''],
      status: ['']
    });

    // Add listener for type changes
    this.paymentForm.get('type')?.valueChanges.subscribe(type => {
      const searchControl = this.paymentForm.get('searchFilter');
      if (type === 'rollNumber') {
        searchControl?.setValidators([Validators.pattern(/^\d+$/)]);
      } else if (type === 'mobileNumber') {
        searchControl?.setValidators([Validators.pattern(/^\d{9,}$/)]);
      } else {
        searchControl?.clearValidators();
      }
      searchControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.fetchClasses();
    this.fetchSections();
  }

  ngAfterViewInit() {
    this.payments.paginator = this.paginator;
    this.payments.sort = this.sort;
  }

  fetchPayments() {
    this.pageLoader.showLoader()
    this.feesServices.getPayments({}).subscribe({
      next: (res) => {
        // Clear existing data first
        this.payments.data = [];

        if (res && Array.isArray(res)) {
          this.payments.data = res;
        } else {
          this.snackBar.dangerNotification('No payments found');
        }
        this.pageLoader.hideLoader()
      },
      error: (error) => {
        // Clear the table data on error
        this.payments.data = [];
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error);
      }
    });
  }

  fetchClasses() {
    this.feesServices.getClasses().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.classes = response.data;
        }
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      }
    });
  }

  fetchSections() {
    this.pageLoader.showLoader()
    this.feesServices.getSections().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.sections = response.data;
          this.pageLoader.hideLoader()
        }
      },
      error: (error) => {
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
      }
    });
  }

  // Add this utility function to format dates

  searchPayments() {
    const formValues = this.paymentForm.value;
    this.pageLoader.showLoader();

    // Validate search filter based on type
    if (formValues.type && formValues.searchFilter) {
      const searchFilter = formValues.searchFilter.trim();

      // Validate roll number format
      if (formValues.type === 'rollNumber' && !/^\d+$/.test(searchFilter)) {
        this.snackBar.dangerNotification('Please enter a valid roll number (numbers only)');
        this.pageLoader.hideLoader();
        return;
      }

      // Validate mobile number format
      if (formValues.type === 'mobileNumber' && !/^\d{9,}$/.test(searchFilter)) {
        this.snackBar.dangerNotification('Please enter a valid mobile number (at least 9 digits)');
        this.pageLoader.hideLoader();
        return;
      }
    }

    // Format the dates properly
    const startDate = formValues.startDate ? formatDate(formValues.startDate) : null;
    const endDate = formValues.endDate ? formatDate(formValues.endDate) : null;

    // Validate dates
    if (!startDate || !endDate) {
      this.snackBar.dangerNotification('Please select both start and end dates');
      this.pageLoader.hideLoader();
      return;
    }

    const payload = {
      searchFilter: formValues.searchFilter ? formValues.searchFilter.trim() : null,
      startDate: startDate,
      endDate: endDate,
      classId: formValues.class ? Number(formValues.class) : null,
      sectionId: formValues.section ? Number(formValues.section) : null,
      type: formValues.type || null,
      status: formValues.status ? Number(formValues.status) : null
    };

    this.feesServices.getPayments(payload).subscribe({
      next: (res) => {
        if (res && Array.isArray(res)) {
          this.payments.data = res;
          if (res.length === 0) {
            this.snackBar.warningNotification('No payments found for the given criteria');
          }
        } else {
          this.payments.data = [];
          this.snackBar.dangerNotification('No payments found');
        }
        this.pageLoader.hideLoader();
      },
      error: (error) => {
        this.payments.data = [];
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error || 'Error fetching payments');
      }
    });
  }

  editPayment(payment: any): void {
    // Logic for editing payment
    console.log('Edit payment:', payment);
  }

  modifyPayment(payment: any): void {
    // Logic for modifying payment
    console.log('Modify payment:', payment);
  }

  viewReceipt(payment: any): void {
    this.pageLoader.showLoader();
    const payload = payment.studentfeeid;
    this.feesServices.generateReceipt(payload).subscribe({
      next: (res) => {
        this.pageLoader.hideLoader();
        const dialogRef = this.dialog.open(ReceiptComponent, {
          width: '90%',
          maxWidth: '850px',
          height: 'auto',
          maxHeight: '90vh',
          data: {
            payments: res.data
          },
          disableClose: false
        });
        this.pageLoader.hideLoader();
        dialogRef.afterClosed().subscribe(() => {
          console.log('Receipt dialog closed');
          this.pageLoader.hideLoader();
        });
      },
      error: (error) => {
        this.payments.data = [];
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
      }
    });
  }

  viewMultipleReceipts(payments: any[]): void {
    // Transform multiple payments into the format expected by receipt component
    const receiptData = {
      payments: payments.map(payment => ({
        fullname: `${payment.studentClass.student.firstname} ${payment.studentClass.student.middlename} ${payment.studentClass.student.lastname}`.trim(),
        rollNo: payment.studentClass.student.rollNumber,
        className: payment.studentClass.class.classname,
        sectionName: payment.studentClass.section.sectionname,
        levelName: payment.studentClass.level?.levelname || 'N/A',
        responsibleName: payment.responsibleId?.firstname || 'N/A',
        monthName: payment.monthName,
        paymentState: payment.paymentStateId.description,
        amount: payment.amount,
        dateCreated: payment.datecreated
      }))
    };

    this.openReceiptDialog(receiptData);
  }

  private openReceiptDialog(data: any): void {
    this.dialog.open(ReceiptComponent, {
      width: '800px',
      data: data,
      disableClose: false
    });
  }

  getSearchPlaceholder(): string {
    const type = this.paymentForm.get('type')?.value;
    switch (type) {
      case 'rollNumber':
        return 'Enter Roll Number';
      case 'mobileNumber':
        return 'Enter Mobile Number';
      case 'class':
        return 'Select Class';
      default:
        return 'Select search type first';
    }
  }
}
