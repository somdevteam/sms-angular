import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '@shared/snackbar.service';
import { UserService } from '../user.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginHistoriesComponent } from './login-histories/login-histories.component';
import {Router} from "@angular/router";
import { AuthService, User } from '@core';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  searchUsersForm!: FormGroup;
  breadscrums = [
    {
      title: 'Search User',
      items: ['User'],
      active: 'Search User',
    },
  ];
  selectedBranch: any;
  branchesList: any;
  selectedStatus: '0' | '1' = '1';

  displayedColumns: string[] = [
      "userId",
      "username",
      "firstName",
      "middleName",
      "lastName",
      "email",
      "mobile",
      "action",
  ];
  userInfo!:User;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private dialog: MatDialog,
    private authService:AuthService

  ) {
    this.userInfo = this.authService.currentUserValue;

  }
  ngOnInit(): void {
    let formFields = {
      branchId: ['', [Validators.required]],
      isActive: ['1'],
    };
    this.searchUsersForm = this.fb.group(formFields)

    this.loadBranches();

  }

  loadUsersBranch() {
    var payload = this.searchUsersForm.value;
    this.pageLoader.showLoader();
    this.userService.getUsersFilter(payload).subscribe({
      next: (res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.pageLoader.hideLoader()
      }),
      error: (error => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error)
      })
    })

  }

  loadBranches() {
    this.userService.getBranches('all').subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.searchUsersForm.patchValue({ branchId: res[0].branchId });
          this.branchesList = res;
        }
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      },
    });
  }

  onSubmit() {
    this.loadUsersBranch()
  }

  resetPassword(data:any) {
    this.dialog.open(ResetPasswordComponent,{
      data
    })
  }

  editUsers(user : any){
    // this.userService.setUserOperation(user);
    // console.log(user);
    // this.router.navigateByUrl('users/edit?edit=true')

   const dialogRef =  this.dialog.open(EditUserComponent, {
      data: user,
      // position: {top: '10%'},
      width: '70%',
    }).afterClosed().subscribe((result) => {
      if (result == 'edited') {
        this.loadUsersBranch()
      }
    });
  }

  loginHistories(data:any) {
    this.dialog.open(LoginHistoriesComponent,{
      data
    })
  }
}
