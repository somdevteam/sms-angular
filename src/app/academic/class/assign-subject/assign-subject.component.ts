import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { AcademicService } from 'app/academic/academic.service';

@Component({
  selector: 'app-assign-subject',
  templateUrl: './assign-subject.component.html',
  styleUrls: ['./assign-subject.component.scss']
})
export class AssignSubjectComponent implements OnInit {

  assignSubjectForm: FormGroup;
  subjects: any[] = [];

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
    private snackBar: SnackbarService,
    public dialogRef: MatDialogRef<AssignSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.assignSubjectForm = this.fb.group({
      class: [this.data.className],
      subjectId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects() {
    const payload = {
      classId: this.data.classId,
      branchId: this.data.branchId
    }
    this.academicService.getunassignedSubjects(payload).subscribe({
      next: (res) => {
        this.subjects = res.data;
      },
      error: (error) => {
        this.snackBar.openSnackBar(error);
        console.error('Error loading subjects', error);
      }
    });
  }

  onAssign() {
    if (this.assignSubjectForm.valid) {
      const payload = {
        classId: this.data.classId,
        branchId: this.data.branchId,
        subjectId: this.assignSubjectForm.value.subjectId
      };

      this.academicService.assignSUbjectToclass(payload).subscribe({
        next: (res) => {
          this.snackBar.openSnackBar(res.message);
          this.dialogRef.close(payload);
        },
        error: (error) => {
          this.snackBar.openSnackBar(error);
          console.error('Error loading subjects', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}