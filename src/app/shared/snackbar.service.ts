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
}
