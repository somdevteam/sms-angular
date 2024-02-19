import { Component } from '@angular/core';
import {AuthService, User} from "@core";
import {Permissions} from "@shared/enums/permissions.enums";
import {UserService} from "../../users/user.service";
import {SnackbarService} from "@shared/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  studentForm!: FormGroup;
  breadscrums = [
    {
      title: 'Add Student',
      items: ['Student'],
      active: 'Add Student',
    },
  ];

  hide = true;
  branchesList:any = []
  rolesList:any = []
  selectedBranch: any;
  isBranch:boolean = false
  userInfo!:User;
  permissions = Permissions.userManagement.users;
  constructor(
    private userService:UserService,
    private snackBar:SnackbarService,
    private route: ActivatedRoute,
    private fb :FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
    this.userInfo = this.authService.currentUserValue;
    this.isBranch = this.userInfo.branch ? true : false;
  }

  get f() {
    return this.studentForm.controls;
  }
  ngOnInit(): void {
    let formFields = {
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      pob: ['', [Validators.required]],
      branchId: [''],
      gender: ['', [Validators.required, Validators.pattern(/^(M|F)$/i)]],
      dateOfBirth: ['', Validators.required]
    }
    this.studentForm = this.fb.group(formFields );

    // this.loadRoles()
    this.loadBranches()
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

  onSubmit() {
    console.log('Form Value', this.studentForm.value);
    if(this.studentForm.valid){
      const payload = this.studentForm.value;

      this.userService.saveUsers(payload).subscribe({
        next: (res => {
          this.router.navigateByUrl('users/userlist')
        }),
        error: (error => {
          this.snackBar.dangerNotification(error)
        })
      })
    }

  }

  isGenderInvalid(): boolean {
    const genderControl = this.studentForm.get('gender');
    return genderControl!.invalid && (genderControl!.dirty || genderControl!.touched);
  }

  isDateOfBirthInvalid(): boolean {
    const dateOfBirthControl = this.studentForm.get('dateOfBirth');
    return dateOfBirthControl!.invalid && (dateOfBirthControl!.dirty || dateOfBirthControl!.touched);
  }

}
