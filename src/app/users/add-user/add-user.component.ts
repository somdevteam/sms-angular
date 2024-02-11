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
  isEdit: boolean = false;
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
    this.route.queryParams.subscribe(params => {
      this.isEdit = params['edit'];
    });
    this.userInfo = this.authService.currentUserValue;
    this.isBranch = this.userInfo.branch ? true : false;
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
      password: ['', [ this.isEdit ? Validators.nullValidator :Validators.required]],
      branchId: [''],
      roleId: ['', Validators.required]
    }
    this.usersForm = this.fb.group(formFields );


    if (this.isEdit) {
      const data = this.userService.getUserOperation();
      console.log(data);
      this.usersForm.patchValue({
        ...this.userService.getUserOperation(),
      });

    }

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
      if (this.isEdit){
        const userId  = this.userService.getUserOperation().userId;
        this.userService.updateUsers(userId, payload).subscribe({
          next: (res => {
            this.router.navigateByUrl('users/userlist')
          }),
          error: (error => {
            this.snackBar.dangerNotification(error)
          })
        })
      } else {
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
