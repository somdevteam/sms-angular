import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<AssignSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.assignSubjectForm = this.fb.group({
      subjectId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.loadSubjects();
  }

  loadSubjects() {
    this.academicService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res;
      },
      error: (error) => {
        console.error('Error loading subjects', error);
      }
    });
  }

  onAssign() {
    if (this.assignSubjectForm.valid) {
      const payload = {
        classId: this.data.classId,
        subjectId: this.assignSubjectForm.value.subjectId
      };
      this.dialogRef.close(payload);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}