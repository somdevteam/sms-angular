import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { AcademicService } from 'app/academic/academic.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';

@Component({
  selector: 'app-assign-section',
  templateUrl: './assign-section.component.html',
  styleUrls: ['./assign-section.component.scss'],
})
export class AssignSectionComponent implements OnInit {
  sectionForm?: FormGroup;
  sectionList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignSectionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { classId: number; className: string; branchId: number },
    private formBuilder: FormBuilder,
    private academicService: AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.sectionForm = this.formBuilder.group({
      class: [this.data.className],
      section: ['', Validators.required],
    });

    this.loadSection();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadSection() {
    const payload = {
      classId: this.data.classId,
      branchId: this.data.branchId,
    };
    console.log(payload);

    this.academicService.findSectionsByFilter(payload).subscribe({
      next: (res) => {
        console.log(res);
        
        this.sectionList = res;
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      },
    });
  }

  onSubmit() {
    const payload = {
      classId: this.data.classId,
      sections: this.sectionForm?.controls['section'].value,
    }
  }  
}
