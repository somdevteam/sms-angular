import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { ResetPasswordComponent } from '../list-users/reset-password/reset-password.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  updateUserForm?: FormGroup;
  branchesList: any;
  isBranch: any;
  rolesList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
    private ref: MatDialogRef<ResetPasswordComponent>,
    private pageLoader: PageLoaderService,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  ngOnInit(): void {

    this.updateUserForm = this.fb.group({
      firstName: [this.userData.firstName, Validators.required],
      middleName: [this.userData.middleName, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      username: [this.userData.username, Validators.required],
      mobile: [this.userData.mobile, Validators.required],
      email: [this.userData.email, Validators.required],
      branchId: [this.userData.branchId],
      roleId: [this.userData.roleId, Validators.required],
    });    

    this.loadBranches()
    this.loadRoles()
  }

  closeDialog(result:any = 'close') {
    this.ref.close(result);
  }

  onSubmit() {
    if (this.updateUserForm?.valid) {
      const userId = this.userData.userId;
      const payload = this.updateUserForm.value;
      this.userService.updateUsers(userId, payload).subscribe({
        next: (res => {
          this.closeDialog('edited')
        }),
        error: (error => {
          this.snackBar.dangerNotification(error)
        })
      })
    }
  }

  loadBranches() {
    this.userService.getBranches().subscribe({
      next:(res => {
        this.branchesList = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next:(res => {
        this.rolesList = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
  }
  


}
