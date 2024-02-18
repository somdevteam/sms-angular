import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  sections: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private academicService: AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService
  ) {}

  ngOnInit(): void {
    this.sectionForm = this.formBuilder.group({
      class: [this.data.className],
      checkboxes: this.formBuilder.group({})
    });

    this.loadSection()
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadSection() {
    this.academicService.findSections().subscribe({
      next:(res) => {
        this.sections = res
        this.sections.forEach(item => {
          this.sectionForm?.addControl(item.sectionid.toString(), new FormControl(false));
        });
      },
      error:(error) => {
        this.snackBar.dangerNotification(error);
     }
    })
  }


  onSubmit() {
    const selectedOptions = this.sections.filter(option => this.sectionForm?.get(option.sectionid.toString())?.value);
    console.log(selectedOptions);
    // Do something with the selected options
  }
}
