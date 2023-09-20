import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { UserService } from 'app/users/user.service';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {
  hide = true;
  inputData:any
  closedMessage = 'closed function using deactive'
  register: UntypedFormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private ref:MatDialogRef<FormDialogComponent>,
    private userService:UserService,
    private fb: UntypedFormBuilder,
    private snacBar: SnackbarService
    ) {
      this.register = this.fb.group({
        firstName: ['', [Validators.required]],
        middleName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        username: ['', [Validators.required]],
        mobile: ['', [Validators.required]],
        password: ['', [Validators.required,Validators.minLength(8)]],
        email: ['', [Validators.required,Validators.email]],
      });
  }

  ngOnInit(): void {
    this.inputData = this.data;
  }

  closeDialog() {
    this.ref.close('close using function');
  }


  mySave() {
   return this.userService.saveUsers(this.register.value).subscribe({
      next: (res) => {
        alert("success");
      },
      error: (error) => {
       this.snacBar.dangerNotification(error)
      }
    })
    //console.log(this.register.value)
  }

}
