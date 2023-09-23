import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { SnackbarService } from '@shared/snackbar.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  usersForm: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Add User',
      items: ['User'],
      active: 'Add User',
    },
  ];
  hide = true;
  branchesList:any = []
  selectedBranch: any;

  constructor(
    private fb: UntypedFormBuilder,
    private userService:UserService,
    private snackBar:SnackbarService
    ) {
    this.usersForm = this.fb.group({
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
      branchId: ['']

    });
  }

  ngOnInit(): void {
   this.loadBranches()
  }
  onSubmit() {
    console.log('Form Value', this.usersForm.value);
    const payload = this.usersForm.value;
    this.userService.saveUsers(payload).subscribe({
      next: (res => {
        // this.snackBar
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
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
}
