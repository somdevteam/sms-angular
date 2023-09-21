import { Component, ViewChild } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { UserDto } from './data/user-dto.model';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


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

  constructor(private authService: AuthService,private pageLoaderService:PageLoaderService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
    ) {
    // constructor
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.pageLoaderService.showLoader();
    this.authService.getUsers().subscribe({
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
     this.loadData()

    });
  }


  openEditForm(data: any) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadData();
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

}
