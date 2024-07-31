import { Component } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {FeesService} from "../fees.service";
import {SnackbarService} from "@shared/snackbar.service";

@Component({
  selector: 'app-allfees',
  templateUrl: './allfees.component.html',
  styleUrls: ['./allfees.component.scss']
})
export class AllfeesComponent {
  paymentForm: FormGroup;
  payments: any[] = [];
  displayedColumns: string[] = [
    'studentfeeid',
    'amount',
    'studentFullName',
    'rollNumber',
    'paymentType',
    'paymentState',
    'datecreated'
  ];
  breadscrums = [
    {
      title: 'Payment',
      items: ['List Of Payments'],
      active: 'Payments',
    },
  ];
  constructor(private fb: FormBuilder,
              private feesServices: FeesService,
              private snackBar: SnackbarService) {
    this.paymentForm = this.fb.group({
      date: [''],
      rollNumber: ['']
    });
  }

  ngOnInit(): void {}


  searchPayments() {
    console.log('Form Value', this.paymentForm.value);
    const formFees = this.paymentForm.value;
    const payload = {
      date: formFees.date,
      rollNumber: formFees.rollNumber,

    }
    this.feesServices.getPayments(payload).subscribe({
      next: (res) => {
        console.log("the resdata: "+JSON.stringify(res));
        if (res) {
            this.payments = res;
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.dangerNotification(error);
      },
    });

  }
}
