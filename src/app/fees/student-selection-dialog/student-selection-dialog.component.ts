import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-student-selection-dialog',
  template: `
    <h2 mat-dialog-title>Select Student</h2>
    <mat-dialog-content>
      <mat-selection-list #studentList [multiple]="false">
        <mat-list-option *ngFor="let student of data.students" [value]="student">
          <div class="student-info">
            <h3>{{student.firstname}} {{student.middlename}} {{student.lastname}}</h3>
            <p>Roll Number: {{student.rollNumber}}</p>
            <p>Class: {{student.studentClass[0]?.className}} - {{student.studentClass[0]?.sectionName}}</p>
            <p>Level: {{student.studentClass[0]?.levelName}}</p>
          </div>
        </mat-list-option>
      </mat-selection-list>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!studentList.selectedOptions.selected[0]"
              (click)="selectStudent(studentList.selectedOptions.selected[0]?.value)">
        Select
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .student-info {
      padding: 8px 0;
    }
    .student-info h3 {
      margin: 0;
      font-weight: 500;
    }
    .student-info p {
      margin: 4px 0;
      color: rgba(0,0,0,0.6);
    }
  `]
})
export class StudentSelectionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StudentSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { students: any[] }
  ) {}

  selectStudent(student: any) {
    this.dialogRef.close(student);
  }
} 