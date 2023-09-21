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
        password:  ['',  !data ? [Validators.required,Validators.minLength(8)] : null] ,
        email: ['', [Validators.required,Validators.email]],
      });
  }

  ngOnInit(): void {
    this.register.patchValue(this.data)
  }

  closeDialog() {
    this.ref.close('close using function');
  }


  submit() {
    if (this.data) {
      return this.userService.updateUsers(this.data.userId,this.register.value).subscribe({
        next: (res) => {
          
          this.closeDialog()
        },
        error: (error) => {
         this.snacBar.dangerNotification(error)
        }
      })
    }else  {
      return this.userService.saveUsers(this.register.value).subscribe({
        next: (res) => {
          alert("added success");
          this.closeDialog()
        },
        error: (error) => {
         this.snacBar.dangerNotification(error)
        }
      })
    }
   
  //   //console.log(this.register.value)
  }

}
