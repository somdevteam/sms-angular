import {Component, Inject} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {FeesService} from "../fees.service";
import {SnackbarService} from "@shared/snackbar.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ResetPasswordComponent} from "../../users/list-users/reset-password/reset-password.component";
import {PageLoaderService} from "../../layout/page-loader/page-loader.service";

@Component({
  selector: 'app-editfees',
  templateUrl: './editfees.component.html',
  styleUrls: ['./editfees.component.scss']
})
export class EditfeesComponent {

  editfeesForm!: UntypedFormGroup;
  selectedRollNumber : any = null;

  paymentTypes:any = [];
  paymentStates:any = [];
  months:any = [];
  constructor(private fb: UntypedFormBuilder,
              private feesServices:FeesService,   private snackBar: SnackbarService,
              private dialog: MatDialog,
              private ref: MatDialogRef<ResetPasswordComponent>,
              private pageLoader: PageLoaderService,
              @Inject(MAT_DIALOG_DATA) public userData: any
              ) {
    this.editfeesForm = this.fb.group({
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
    this.feesServices.getAllMonths().subscribe({
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
    this.feesServices.getStudentsByRollNumber(payload.rollNumber).subscribe({
      next: (res) => {
        console.log("the resdata: "+JSON.stringify(res));
        if (res) {
          const studentData = res;
          const studentName = '' // this.createFullName(studentData.firstanme,studentData.middlename,studentData.lastname) || null;
          console.log("fullname "+studentName)
          const studentClassId =1; // studentData.studentClass[0].studentClassId;
          this.editfeesForm.patchValue({
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

  closeDialog(result:any = 'close') {
    this.ref.close(result);
  }
  onSubmit() {
    console.log('Form Value', this.editfeesForm.value);
    const formFees = this.editfeesForm.value;
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
    // this.feesServices.createPayment(payload).subscribe({
    //   next: (res) => {
    //     console.log("the resdata: "+JSON.stringify(res));
    //     if (res) {
    //       this.editfeesForm.reset();
    //     }
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.snackBar.dangerNotification(error);
    //   },
    // });

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
