import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SnackbarService } from '@shared/snackbar.service';
import { UserService } from '../user.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  searchUsersForm: UntypedFormGroup;
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
  ]

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService
  ) {
    this.searchUsersForm = this.searchUsersForm = this.fb.group({
      branchId: ['', [Validators.required]],
      isActive: ['1'],
    });
  }
  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches() {
    this.userService.getBranches().subscribe({
      next: (res) => {
        this.branchesList = res;
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      },
    });
  }

  onSubmit() {
    const payload = this.searchUsersForm.value;

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
}
