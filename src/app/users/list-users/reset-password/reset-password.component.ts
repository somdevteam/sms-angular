import { Component, Inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { UserService } from 'app/users/user.service';

export function confirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors[matchingControlName]) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPassword: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {
  resetForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
    private ref: MatDialogRef<ResetPasswordComponent>,
    private pageLoader: PageLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: confirmPasswordValidator('password', 'confirmPassword')
    })
  }


  closeDialog() {
    this.ref.close()
  }

  onSubmit() {
    const password = this.resetForm.controls['password'].value;
    const confirm = this.resetForm.controls['confirmPassword'].value;
    const payload = { password: password, confirmPassword: confirm }
    this.pageLoader.showLoader();
    this.userService.resetPassword(this.data.userId, payload).subscribe({
      next: (res => {
        this.pageLoader.hideLoader()
        this.closeDialog()
      }),
      error: (error => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error)
      })
    })

  }
}
