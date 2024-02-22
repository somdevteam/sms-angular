import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, UntypedFormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../users/user.service";
import {SnackbarService} from "@shared/snackbar.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ResetPasswordComponent} from "../../users/list-users/reset-password/reset-password.component";
import {PageLoaderService} from "../../layout/page-loader/page-loader.service";
import {StudentsService} from "../students.service";

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})

export class EditStudentComponent {

  updateUserForm?: FormGroup;
  branchesList: any;
  isBranch: any;
  rolesList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private studentsService: StudentsService,
    private snackBar: SnackbarService,
    private ref: MatDialogRef<ResetPasswordComponent>,
    private pageLoader: PageLoaderService,
    @Inject(MAT_DIALOG_DATA) public userData: any
  ) {}

  ngOnInit(): void {

    console.log(this.userData);
    this.updateUserForm = this.fb.group({
      firstName: [this.userData.firstName, Validators.required],
      middleName: [this.userData.middleName, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      pob: [this.userData.pob, Validators.required],
      rollNumber: [this.userData.rollNumber, Validators.required],
      responsibleName: [this.userData.responsibleName, Validators.required],
      responsiblePhone: [this.userData.responsiblePhone],
      branchId: [this.userData.branchId, Validators.required],
    });

    this.loadBranches()
    this.loadRoles()
  }

  closeDialog(result:any = 'close') {
    this.ref.close(result);
  }

  onSubmit() {
    if (this.updateUserForm?.valid) {
      console.log(this.userData);
      const studentId = this.userData.studentid;
      const payload = this.updateUserForm.value;
      payload.responsibleId = this.userData.responsibleid;
      this.studentsService.updateStudents(studentId, payload).subscribe({
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
