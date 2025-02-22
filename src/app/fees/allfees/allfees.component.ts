import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FeesService } from "../fees.service";
import { SnackbarService } from "@shared/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Payment } from "../fees";
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';

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

@Component({
  selector: 'app-allfees',
  templateUrl: './allfees.component.html',
  styleUrls: ['./allfees.component.scss']
})
export class AllfeesComponent implements OnInit {
  paymentForm: FormGroup;
  payments: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();
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
      startDate: [null],
      endDate: [null],
      class: [''],
      section: [''],
      type: [''],
      status: ['']
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
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  searchPayments() {
    const formValues = this.paymentForm.value;
    this.pageLoader.showLoader();
    
    // Format the dates properly
    const startDate = formValues.startDate ? this.formatDate(formValues.startDate) : null;
    const endDate = formValues.endDate ? this.formatDate(formValues.endDate) : null;

    const payload = {
      searchFilter: formValues.searchFilter,
      startDate: startDate,
      endDate: endDate,
      classId: formValues.class ? Number(formValues.class) : null,
      sectionId: formValues.section ? Number(formValues.section) : null,
      type: formValues.type ? formValues.type : null,
      status: formValues.status ? Number(formValues.status) : null
    };
    console.log(payload);
    this.feesServices.getPayments(payload).subscribe({
      next: (res) => {
        // Clear existing data first
        this.payments.data = [];
        
        if (res && Array.isArray(res)) {
          this.payments.data = res;
        } else {
          this.snackBar.dangerNotification('No payments found');
        }
        this.pageLoader.hideLoader();
      },
      error: (error) => {
        // Clear the table data on error
        this.payments.data = [];
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
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
    // Logic for viewing receipt
    console.log('View receipt:', payment);
  }
  onSearch() {

  }
}
