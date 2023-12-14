import {Component, Inject, ViewChild} from '@angular/core';
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {UserService} from "../../user.service";
import {SnackbarService} from "@shared/snackbar.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PageLoaderService} from "../../../layout/page-loader/page-loader.service";
import {AuthService, User} from "@core";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-histories',
  templateUrl: './login-histories.component.html',
  styleUrls: ['./login-histories.component.scss']
})
export class LoginHistoriesComponent {
  searchLoginHistoryForm!: FormGroup;
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
    "loginHistoryId",
    "userId",
    "ip",
    "browser",
    "loginDate",
    "logoutDate"
  ];
  isEdit: boolean = false;
  isBranch:boolean = false
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
    private router: Router,
    private ref:MatDialogRef<LoginHistoriesComponent>,
    private authService:AuthService

  ) {
    this.userInfo = this.authService.currentUserValue;
    this.isBranch = this.userInfo.branch ? true : false;

  }
  ngOnInit(): void {
    let formFields = {
      branchId: ['', [Validators.required]],
      isActive: ['1'],
    };
    this.searchLoginHistoryForm = this.fb.group(formFields)
    this.loadUsersBranch()
  }

  loadUsersBranch() {
    const payload = {branchId: this.userInfo.branch,isActive:1};
    this.pageLoader.showLoader();
    this.userService.getUserLoginHistory(this.userInfo.id).subscribe({
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

  closeDialog() {
    this.ref.close()
  }


}
