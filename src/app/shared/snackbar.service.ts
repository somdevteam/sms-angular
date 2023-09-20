// snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.snackBar.open(text, '', {
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

}
