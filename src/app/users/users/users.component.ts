import { Component } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { UserDto } from './data/user-dto.model';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from './form-dialog/form-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  breadscrums = [
    {
      title: 'Users',
      items: ['Create User'],
      active: 'Users',
    },
  ];

  error = '';
  users: UserDto[] = [];
  constructor(private authService: AuthService,private pageLoaderService:PageLoaderService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
    ) {
    // constructor
  }

  ngOnInit() {
    this.pageLoaderService.showLoader();
    this.authService.getUsers().subscribe({
      next: (res) => {
        if (res) {
          this.users = res;
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
   var _popup = this.dialog.open(FormDialogComponent,{
      'width': '50%',
      // enterAnimationDuration: '1000ms',
      // exitAnimationDuration: '1000ms',
      'data': {
        'title': 'Edit User'
      }
      });
    _popup.afterClosed().subscribe(item => {
      console.log(item)
      alert(item)

    });
  }

}
