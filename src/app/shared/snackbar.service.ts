// snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string = 'Close', duration: number = 2000) {
    this.snackBar.open(message, action, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
      duration: duration,
    });
  }

  successNotification(text: string,) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'snackbar-success',
    });
  }

  dangerNotification(text: string,) {
    this.snackBar.open(text, 'Ok', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'snackbar-danger',
    });
  }

  warningNotification(text: string,) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'snackbar-warning',
    });
  }

  blackNotification(text: string,) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'black',
    });
  }


  successDialo1(title:string = '',message:string) {
    Swal.fire({
      // position: 'top-end',
      icon: 'success',
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 3000,
    });
  }

  successDialog(title:string,message:string) {
    Swal.fire(
      title,
      message,
      'success'
    );
  }

  errorDialog(title:string,message:string) {
    Swal.fire(
      title,
      message,
      'error'
    );
  }
  
  showConfirmationDialog(text: string, title: string = 'Are you sure?'): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    }).then((result) => result.value === true);
  }

}
