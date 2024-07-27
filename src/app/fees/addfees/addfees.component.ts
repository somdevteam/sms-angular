import { Component } from '@angular/core';
import {BreadcrumbComponent} from "@shared/components/breadcrumb/breadcrumb.component";
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
  paymentTypes:any = []
  constructor(private fb: UntypedFormBuilder,
              private feesServices:FeesService,   private snackBar: SnackbarService,) {
    this.feesForm = this.fb.group({
      rollNo: ['', [Validators.required]],
      sName: ['', [Validators.required]],
      fType: ['', [Validators.required]],
      department: ['', [Validators.required]],
      date: ['', [Validators.required]],
      invoiceNo: ['', [Validators.required]],
      pType: ['', [Validators.required]],
      status: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      details: [''],
    });
  }

  ngOnInit(): void {
    this.loadPaymentTypes();

  }
  // onChangeRollNumber(value: any) {
  //   this.selectedRollNumber = Number(value.target.value);
  //   // const fees =this.feesServices.getStudentByRollNumber(this.selectedRollNumber);
  //   // console.log(fees);
  //
  //   this.feesServices.getStudentByRollNumber(this.selectedRollNumber).subscribe({
  //     next: (res) => {
  //       if (res.length > 0) {
  //         console.log(res);
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.snackBar.dangerNotification(error);
  //     },
  //   });
  // }

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

  onChangeRollNumber(event: any) {
    this.selectedRollNumber = Number(event.target.value);
    this.feesServices.getStudentByRollNumber(this.selectedRollNumber).subscribe({
      next: (res) => {
        console.log("the resdata: "+JSON.stringify(res));
        if (res) {
          const studentData = res;
          const studentName = this.createFullName(studentData.firstname,studentData.middlename,studentData.lastname);
          console.log("fullname "+studentName)
          const studentClassId = studentData.studentClass[0]?.studentClassId;
          this.feesForm.patchValue({
            sName: studentName
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
