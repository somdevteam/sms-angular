import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-generate-charges-dialog',
  templateUrl: './generate-charges-dialog.component.html',
  styleUrls: ['./generate-charges-dialog.component.scss']
})
export class GenerateChargesDialogComponent implements OnInit {
  generateForm: FormGroup;
  classes: any[] = [];
  sections: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GenerateChargesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.classes = data.classes;
    this.sections = data.sections;
    
    this.generateForm = this.fb.group({
      classId: ['', Validators.required],
      sectionId: ['', Validators.required],
      dueCategory: ['', Validators.required],
      dueDate: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.generateForm.get('classId')?.valueChanges.subscribe(classId => {
      if (classId) {
        this.sections = this.data.sections.filter((section: any) => 
          section.classId === classId
        );
        this.generateForm.patchValue({ sectionId: '' });
      } else {
        this.sections = [];
      }
    });
  }

  onSubmit(): void {
    if (this.generateForm.valid) {
      const formValue = this.generateForm.value;
      this.dialogRef.close({
        classId: formValue.classId,
        sectionId: formValue.sectionId,
        dueCategory: formValue.dueCategory,
        dueDate: formValue.dueDate.toISOString(),
        amount: formValue.amount
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 