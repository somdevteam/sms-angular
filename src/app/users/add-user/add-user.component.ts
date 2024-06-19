import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { UserService } from '../user.service';
import { SnackbarService } from '@shared/snackbar.service';
import {ActivatedRoute, Router} from "@angular/router";
import { AuthService, User } from '@core';
import {Permissions} from "@shared/enums/permissions.enums";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  usersForm!: FormGroup;
  breadscrums = [
    {
      title: 'Add User',
      items: ['User'],
      active: 'Add User',
    },
  ];
  hide = true;
  branchesList:any = []
  rolesList:any = []
  selectedBranch: any;
  userInfo!:User;
  permissions = Permissions.userManagement.users;

  constructor(
    private userService:UserService,
    private snackBar:SnackbarService,
    private fb :FormBuilder,
    private router: Router,
    public authService: AuthService
    ) {
    this.userInfo = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    let formFields = {
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      username: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: ['', [Validators.required]],
      branchId: [''],
      roleId: ['', Validators.required]
    }
    this.usersForm = this.fb.group(formFields );

  this.loadRoles()
   this.loadBranches()
  }

  get f() {
    return this.usersForm.controls;
  }
  onSubmit() {
    console.log('Form Value', this.usersForm.value);
    if(this.usersForm.valid){
      const payload = this.usersForm.value;

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

  loadBranches() {
    this.userService.getBranches('all').subscribe({
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
