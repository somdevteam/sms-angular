import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { AcademicService } from 'app/academic/academic.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';

export enum DialogMode {
 
  Edit = 'edit',
  Add = 'add',
  AddBranch = 'addbranch'
}

@Component({
  selector: 'app-academic-dialog',
  templateUrl: './academic-dialog.component.html',
  styleUrls: ['./academic-dialog.component.scss']
})
export class AcademicDialogComponent implements OnInit {

  mode?: DialogMode;
  academicData: any;
  form?: FormGroup;
  // Expose the enum for use in the template
  dialogModeEnum = DialogMode;

  constructor(
    public dialogRef: MatDialogRef<AcademicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private pageLoader: PageLoaderService,
    private academicService: AcademicService,
    private snackBar: SnackbarService
  ) {

  }
  ngOnInit(): void {
    this.mode = this.data.mode as DialogMode;
    this.academicData = this.data.academic;    

    this.initializeForm()
    if (this.mode === DialogMode.Edit) {
      this.form?.patchValue(this.academicData)
      console.log(this.academicData);
      
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {

    if (this.mode === DialogMode.Add) {
      this.newAcademic()
    } else if (this.mode === DialogMode.Edit) {
      this.updateAcademic()
      
    }
  }

  newAcademic() {
    const payload = this.form?.value;
    this.pageLoader.showLoader()
    this.academicService.saveAcademicYear(payload).subscribe({
      next: (res) => {
        this.pageLoader.hideLoader()
        this.closeDialog()
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.errorDialog('',error);
      },
    });
  }

  updateAcademic() {
    const payload = this.form?.value;
    const id = this.academicData.academicId;
    this.pageLoader.showLoader()
    this.academicService.updateAcademicYear(id,payload).subscribe({
      next: (res) => {
        this.pageLoader.hideLoader()
        this.closeDialog()
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.errorDialog('',error);
      },
    });
  }


  private initializeForm(): void {

    if ( this.mode === DialogMode.Add|| this.mode === DialogMode.Edit) {
      
      this.form = this.formBuilder.group({
        academicYear: ['', Validators.required],
        isActive: [true],
      });

    } else if ( this.mode === DialogMode.AddBranch) {
      
      this.form = this.formBuilder.group({
       
      });

    }
  }



  getDialogTitle(): string {
    switch (this.mode) {
      case DialogMode.Edit:
        return 'Edit Academic';
      case DialogMode.Add:
        return 'Add Academic';
      case DialogMode.AddBranch:
        return 'Assing Branch';
      default:
        return 'unknown';
    }
  }
  
  getSaveButtonLabel(): string {
    switch (this.mode) {
      case DialogMode.Edit:
        return 'Edit';
      case DialogMode.Add:
        return 'Add';
      case DialogMode.AddBranch:
        return 'Assing';
      default:
        return 'unknown';
    }
  }
  

}
