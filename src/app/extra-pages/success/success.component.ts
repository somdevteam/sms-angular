import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<SuccessComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit(): void {
  }

}
