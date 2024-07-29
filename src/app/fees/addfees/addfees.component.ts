import { Component } from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {FeesService} from "../fees.service";
import {SnackbarService} from "@shared/snackbar.service";


@Component({
  selector: 'app-addfees',
  templateUrl: './addfees.component.html',
  styleUrls: ['./addfees.component.scss'],

})

export class AddfeesComponent {
  feesForm!: UntypedFormGroup;
  selectedRollNumber : any = null;
  breadscrums = [
    {
      title: 'Add Fees',
      items: ['Fees'],
      active: 'Add Fees',
    },
  ];
  paymentTypes:any = [];
  paymentStates:any = [];
  months:any = [];
  constructor(private fb: UntypedFormBuilder,
              private feesServices:FeesService,   private snackBar: SnackbarService,) {
    this.feesForm = this.fb.group({
      rollNo: ['', [Validators.required]],
      sName: ['', [Validators.required]],
      fType: ['', [Validators.required]],
      department: [''],
      date: ['', [Validators.required]],
      invoiceNo: [''],
      pType: ['', [Validators.required]],
      status: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      duration: [''],
      details: [''],
      studentClassId: ['', [Validators.required]],
      monthName :['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPaymentTypes();
    this.loadPaymentStates();
    this.loadMonths();
  }


  loadPaymentTypes() {
    this.feesServices.getPaymentTypes().subscribe({
      next:(res => {
        console.log(res);
        this.paymentTypes = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
  }

  loadPaymentStates() {
    this.feesServices.getPaymentStates().subscribe({
      next:(res => {
        console.log(res);
        this.paymentStates = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
  }
  loadMonths() {
    this.feesServices.getMonths().subscribe({
      next:(res => {
        console.log(res);
        this.months = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
  }

  onChangeRollNumber(event: any) {
    this.selectedRollNumber = Number(event.target.value);
    const payload ={ rollNumber:this.selectedRollNumber}
    this.feesServices.getStudentByRollNumber(payload).subscribe({
      next: (res) => {
        console.log("the resdata: "+JSON.stringify(res));
        if (res) {
          const studentData = res;
          const studentName = this.createFullName(studentData.firstname,studentData.middlename,studentData.lastname);
          console.log("fullname "+studentName)
          const studentClassId = studentData.studentClass[0].studentClassId;
          this.feesForm.patchValue({
            sName: studentName,
            studentClassId:studentClassId
          });
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.dangerNotification(error);
      },
    });
  }


  onSubmit() {
    console.log('Form Value', this.feesForm.value);
    const formFees = this.feesForm.value;
    const payload = {
      studentClassId: formFees.studentClassId,
      sName: formFees.sName,
      paymentTypeId:formFees.pType,
      paymentStateId: formFees.status,
      rollNo: formFees.rollNo,
      amount:formFees.amount,
      description: formFees.description,
      monthName:formFees.monthName
    }
    this.feesServices.createPayment(payload).subscribe({
      next: (res) => {
        console.log("the resdata: "+JSON.stringify(res));
        if (res) {
          this.feesForm.reset();
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.dangerNotification(error);
      },
    });

  }

   createFullName(firstName:string, middleName:string, lastName:string) {
    firstName = this.trimString(firstName);
    middleName = this.trimString(middleName);
    lastName = this.trimString(lastName);

    var fullName = (firstName || '') + ' ' + (middleName || '') + ' ' + (lastName || '');

    if(fullName)
      fullName = this.trimString(fullName).toLowerCase();
    return fullName.replace(/[^a-zA-Z0-9\/ ]/g,'');
  }

  trimString(str:any) {
    if(str) {
      str = str.toString().replace(/\s\s+/g, ' ');
      str = str.trim();
    }
    return str;
  }

}
