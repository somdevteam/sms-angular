import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FeesService } from "../fees.service";
import { SnackbarService } from "@shared/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Payment } from "../fees";

@Component({
  selector: 'app-allfees',
  templateUrl: './allfees.component.html',
  styleUrls: ['./allfees.component.scss']
})
export class AllfeesComponent implements OnInit {
  paymentForm: FormGroup;
  payments: MatTableDataSource<Payment> = new MatTableDataSource<Payment>();
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
  ) {
    this.paymentForm = this.fb.group({
      date: [''],
      rollNumber: ['']
    });
  }

  ngOnInit(): void {
    this.fetchPayments();
  }

  ngAfterViewInit() {
    this.payments.paginator = this.paginator;
    this.payments.sort = this.sort;
  }

  fetchPayments() {
    // Initially fetch all payments
    this.feesServices.getPayments({}).subscribe({
      next: (res) => {
        if (res) {
          this.payments.data = res;
        }
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      }
    });
  }

  searchPayments() {
    const formFees = this.paymentForm.value;
    const payload = {
      date: formFees.date,
      rollNumber: formFees.rollNumber,
    };
    this.feesServices.getPayments(payload).subscribe({
      next: (res) => {
        if (res) {
          this.payments.data = res;
        }
      },
      error: (error) => {
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
}
