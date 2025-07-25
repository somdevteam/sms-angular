import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Role, AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { SnackbarService } from '@shared/snackbar.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['omar', Validators.required],
      password: ['qwer1234', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  adminSet() {
    this.authForm.get('username')?.setValue('admin@school.org');
    this.authForm.get('password')?.setValue('admin@123');
  }
  teacherSet() {
    this.authForm.get('username')?.setValue('teacher@school.org');
    this.authForm.get('password')?.setValue('teacher@123');
  }
  studentSet() {
    this.authForm.get('username')?.setValue('student@school.org');
    this.authForm.get('password')?.setValue('student@123');
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.subs.sink = this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe({
          next: (res) => {
            if (res) {
              setTimeout(() => {
                const role = this.authService.currentUserValue.role;
                console.log(role)
                if (role === Role.All || role === Role.Admin || role === Role.SuperAdmin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Teacher) {
                  this.router.navigate(['/teacher/dashboard']);
                } else if (role === Role.Student) {
                  this.router.navigate(['/student/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
                this.loading = false;
              }, 1000);
            } else {
              this.error = 'Invalid Login';
            }
          },
          error: (error) => {
            this.snackBar.dangerNotification(error)
            this.error = error;
            this.loading
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }
}
