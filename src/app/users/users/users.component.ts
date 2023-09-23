import { Component, ViewChild } from '@angular/core';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
[x: string]: any;
  breadscrums = [
    {
      title: 'Users',
      items: ['Create User'],
      active: 'Users',
    },
  ];

  branches: any[] = [];
  selectedBranch: any;
  selectedStatus: '0' | '1' = '1';

  displayedColumns: string[] = [
    'userId',
    'username',
    'email',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  error = '';
  searchForm: FormGroup;

  constructor(
    private userService: UserService,
    private pageLoaderService:PageLoaderService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    ) {
      this.searchForm = this.fb.group({
        branch: ['', [Validators.required]],
        status: ['']
      });
  }

  ngOnInit() {

    
    this.loadUsers()
    this.loadBranches()
  }

  loadUsers() {
    this.pageLoaderService.showLoader();
    this.userService.getUsers().subscribe({
      next: (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
          this.pageLoaderService.hideLoader();
        }else {
          this.error = 'Invalid Login';
        }
        
      },
      error: (error) => {
        // alert(error)
        this.snackbar.openSnackBar(error)
        this.pageLoaderService.hideLoader();
      }
    });
  }

  addNew() {
   var _popup = this.dialog.open(FormDialogComponent);
    _popup.afterClosed().subscribe(item => {
      console.log(item)
     this.loadUsers()

    });
  }

  searchUsers() {
    alert(this.selectedStatus)
    console.log(this.searchForm.value)
  }


  openEditForm(data: any) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadUsers();
        }
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadBranches() {
    this.userService.getBranches().subscribe({
      next: (res => {
        this.branches = res;
      }),
      error: (error => {
        this.snackbar.dangerNotification(error)
      })
    })
  }

  searchUsersByBranch() {
    alert(this.selectedStatus)
    console.log(this.selectedBranch);
  }

}
