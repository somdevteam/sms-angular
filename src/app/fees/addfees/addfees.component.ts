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


  }
  onChangeRollNumber(value: any) {
    this.selectedRollNumber = Number(value.target.value);
    // const fees =this.feesServices.getStudentByRollNumber(this.selectedRollNumber);
    // console.log(fees);

    this.feesServices.getStudentByRollNumber(this.selectedRollNumber).subscribe({
      next: (res) => {
        if (res.length > 0) {
          console.log(res);
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
}
